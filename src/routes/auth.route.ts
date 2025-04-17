import express from "express";
import {
  checkAuth,
  isUsernameAvailable,
  login,
  logout,
  register,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import {
  checkUsernameSchema,
  loginSchema,
  registerSchema,
} from "../validators/auth.validator";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post(
  "/check-username",
  validate(checkUsernameSchema),
  isUsernameAvailable
);
router.get("/logout", logout);

router.get("/checkAuth", protect, checkAuth);

export default router;
