import Message from "../models/message.model";
import { ApiError } from "../utils/ApiError";

export const editMessage = async (
  userId: string,
  messageId: string,
  newText: string,
) => {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError("Message not found", 404);
  }

  if (message.senderId.toString() !== userId) {
    throw new ApiError("Unauthorized", 400);
  }

  const updated = await Message.editMessage(messageId, newText);
  console.log(updated);
  return updated;
};

export const deleteMessage = async (userId: string, messageId: string) => {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError("Message not found", 404);
  }
  if (message.senderId.toString() !== userId) {
    throw new ApiError("Unauthorized", 400);
  }

  const isDeleted = await Message.deleteMessage(messageId);
  return isDeleted;
};
