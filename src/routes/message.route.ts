import { Router } from "express";
import { validate } from "../middlewares/validate";
import { messageSchema } from "../validators/message.validator";
import {
  getFriendList,
  getMessages,
  sendMessage,
} from "../controllers/message.controller";
import { protect } from "../middlewares/protect";

const router = Router();

router.post(
  "/send-message/:friendId",
  protect,
  validate(messageSchema),
  sendMessage
);

router.get("/get-messages/:friendId", protect, getMessages);
router.get("/get-friend-list", protect, getFriendList);

export default router;
