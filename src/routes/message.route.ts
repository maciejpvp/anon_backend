import { Router } from "express";
import { validate } from "../middlewares/validate";
import { messageSchema } from "../validators/message.validator";
import { getMessages, sendMessage } from "../controllers/message.controller";

const router = Router();

router.post("/send-message", validate(messageSchema), sendMessage);

router.get("/get-messages/:id", getMessages);

export default router;
