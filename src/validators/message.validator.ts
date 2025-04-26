import Joi from "joi";

export const messageSchema = Joi.object({
  message: Joi.string().min(1).max(3000).required(),
});

export const getMessagesSchema = Joi.object({
  userId: Joi.string().min(3).max(30).required(),
});

export const editMessageSchema = Joi.object({
  newText: Joi.string().min(1).max(3000).required(),
});
