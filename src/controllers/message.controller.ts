import { getUserSocketIds, io } from "../lib/socket";
import Message from "../models/message.model";
import User from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";
import * as MessageServices from "../services/message.service";

export const sendMessage = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const { message } = req.body;
  const { friendId } = req.params;
  const newMessage = await Message.sendMessage(userId, friendId, message);
  const receiverSockets = getUserSocketIds(friendId);
  const userSockets = getUserSocketIds(userId);
  if (receiverSockets) {
    io.to(receiverSockets).emit("new-message", newMessage);
  }
  if (userSockets) {
    io.to(userSockets).emit("new-message", newMessage);
  }

  res.status(200).json({
    success: true,
    data: newMessage,
  });
});

export const getMessages = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const { friendId } = req.params;
  const { beforeDate, limit } = req.query;

  const parsedLimit = parseInt(limit as string) || 5;
  const parsedBeforeDate = beforeDate
    ? new Date(beforeDate as string)
    : undefined;

  const messages = await Message.getMessagesBetweenUsers(
    userId,
    friendId,
    parsedBeforeDate,
    parsedLimit,
  );

  res.status(200).json({ messages });
});

export const getFriendList = catchAsync(async (req, res) => {
  //TODO: use correct statics function
  const userId = req.user?.userId || "";
  const users = await User.find({ _id: { $ne: userId } }).select(
    "_id username profilePic publicKey",
  );
  res.status(200).json({
    success: true,
    data: users,
  });
});

export const editMessage = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const { messageId } = req.params;
  const { newText } = req.body;

  const updated = await MessageServices.editMessage(userId, messageId, newText);

  const receiverSockets = getUserSocketIds(updated.receiverId.toString());
  const userSockets = getUserSocketIds(userId);
  if (receiverSockets) {
    io.to(receiverSockets).emit("edit-message", updated);
  }
  if (userSockets) {
    io.to(userSockets).emit("edit-message", updated);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
});

export const deleteMessage = catchAsync(async (req, res) => {
  const userId = req.user?.userId || "";
  const { messageId } = req.params;

  const isDeleted = await MessageServices.deleteMessage(userId, messageId);

  res.status(204).json({
    success: isDeleted,
    data: null,
  });
});
