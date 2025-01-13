import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().max(50),
  description: Joi.string().required().max(50),
  price: Joi.number().positive().required(),
  stock: Joi.number().min(0).required()
});