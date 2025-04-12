import Joi from "joi";

export const messageSchema = Joi.object({
  userId: Joi.string().min(3).max(30).required(),
  message: Joi.string().min(1).max(3000).required(),
});

export const getMessagesSchema = Joi.object({
  userId: Joi.string().min(3).max(30).required(),
});
