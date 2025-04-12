import Message from "../models/message.model";
import { catchAsync } from "../utils/catchAsync";

export const sendMessage = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const { friendId, message } = req.body;
  const newMessage = await Message.sendMessage(userId, friendId, message);
  res.status(200).json({
    success: true,
    data: newMessage,
  });
});

export const getMessages = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const { friendId } = req.params;
  const messages = await Message.getMessagesBetweenUsers(userId, friendId);
  res.status(200).json({
    messages,
  });
});
