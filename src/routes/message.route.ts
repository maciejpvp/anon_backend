import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  editMessageSchema,
  messageSchema,
} from "../validators/message.validator";
import * as MessageController from "../controllers/message.controller";
import { protect } from "../middlewares/protect";

const router = Router();

router.post(
  "/send-message/:friendId",
  protect,
  validate(messageSchema),
  MessageController.sendMessage,
);

router.post(
  "/edit-message/:messageId",
  protect,
  validate(editMessageSchema),
  MessageController.editMessage,
);

router.delete(
  "/delete-message/:messageId",
  protect,
  MessageController.deleteMessage,
);

router.get("/get-messages/:friendId", protect, MessageController.getMessages);
router.get("/get-friend-list", protect, MessageController.getFriendList);

export default router;
