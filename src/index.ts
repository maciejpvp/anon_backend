import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import compression from "compression";
import morgan from "morgan";

import { app, server } from "./lib/socket";
import { connectDB } from "./lib/db";

import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(xss());
app.use(hpp());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1000,
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

app.use(compression());

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
