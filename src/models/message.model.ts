import mongoose, { Document, Model, Schema } from "mongoose";

interface IMessage {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string;
  image?: string;
}

interface IMessageDocument extends IMessage, Document {}

interface IMessageModel extends Model<IMessageDocument> {
  getMessagesBetweenUsers(
    user1: string,
    user2: string
  ): Promise<IMessageDocument[]>;
  sendMessage(
    userId: string,
    friendId: string,
    message: string
  ): Promise<IMessageDocument>;
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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

messageSchema.statics.getMessagesBetweenUsers = function (
  user1: string,
  user2: string
) {
  return this.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  }).exec();
};

messageSchema.statics.sendMessage = async function (
  userId: string,
  friendId: string,
  message: string
) {
  return this.create({
    senderId: userId,
    receiverId: friendId,
    text: message,
  });
};

const Message = mongoose.model<IMessageDocument, IMessageModel>(
  "Message",
  messageSchema
);

export default Message;
