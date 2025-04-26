import mongoose, { Document, Model, Schema } from "mongoose";

interface IMessage {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string;
  isEdited: boolean;
  image?: string;
}

interface IMessageDocument extends IMessage, Document {}

interface IMessageModel extends Model<IMessageDocument> {
  getMessagesBetweenUsers(
    user1: string,
    user2: string,
    beforeDate?: Date,
    limit?: number,
  ): Promise<IMessageDocument[]>;
  sendMessage(
    userId: string,
    friendId: string,
    message: string,
  ): Promise<IMessageDocument>;
  editMessage(messageId: string, newText: string): Promise<IMessage>;
  deleteMessage(messageId: string): Promise<boolean>;
}

const messageSchema = new Schema<IMessageDocument>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

messageSchema.statics.getMessagesBetweenUsers = function (
  user1: string,
  user2: string,
  beforeDate?: Date,
  limit = 30,
) {
  const filter: any = {
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  };

  if (beforeDate) {
    filter.createdAt = { $lt: beforeDate };
  }

  return this.find(filter)
    .sort({ createdAt: -1 }) // Newest first
    .limit(limit);
};

messageSchema.statics.sendMessage = async function (
  userId: string,
  friendId: string,
  message: string,
) {
  return this.create({
    senderId: userId,
    receiverId: friendId,
    text: message,
  });
};

messageSchema.statics.editMessage = async function (
  messageId: string,
  newText: string,
) {
  const updated = await this.findByIdAndUpdate(
    messageId,
    { text: newText, isEdited: true },
    { new: true },
  );
  return updated;
};

messageSchema.statics.deleteMessage = async function (messageId) {
  const deletedMessage = await this.findByIdAndDelete(messageId);
  const isDeleted = !!deletedMessage;
  return isDeleted;
};

messageSchema.statics.getFriendList = async function () {};

const Message = mongoose.model<IMessageDocument, IMessageModel>(
  "Message",
  messageSchema,
);

export default Message;
