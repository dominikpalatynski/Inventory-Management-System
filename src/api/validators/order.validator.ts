import Joi from 'joi';

export const orderProductItemSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().positive().required()
  });
  
  export const createOrderSchema = Joi.object({
    customerId: Joi.string().required(),
    products: Joi.array().items(orderProductItemSchema).min(1).required()
  });