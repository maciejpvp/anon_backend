import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap: Record<string, Set<string>> = {}; // { userId: Set<socketId> }

function addUserSocket(userId: string, socketId: string) {
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = new Set();
  }
  userSocketMap[userId].add(socketId);
}

function removeUserSocket(userId: string, socketId: string) {
  const sockets = userSocketMap[userId];
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) {
      delete userSocketMap[userId];
    }
  }
}

export function getReceiverSocketIds(userId: string): string[] | undefined {
  return userSocketMap[userId] ? Array.from(userSocketMap[userId]) : undefined;
}

function getOnlineUserIds(): string[] {
  return Object.keys(userSocketMap);
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId) {
    addUserSocket(userId, socket.id);
  }

  io.emit("getOnlineUsers", getOnlineUserIds());

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) {
      removeUserSocket(userId, socket.id);
    }

    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

export { io, app, server };
