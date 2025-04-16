import Message from "../models/message.model";
import User from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";

export const sendMessage = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const { message } = req.body;
  const { friendId } = req.params;
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
  console.log(messages);
  res.status(200).json({
    messages,
  });
});

export const getFriendList = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const users = await User.find({ _id: { $ne: userId } });
  res.status(200).json({
    success: true,
    data: users,
  });
});
