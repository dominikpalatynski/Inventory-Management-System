import Joi from 'joi';

export const stockOperationSchema = Joi.object({
  quantity: Joi.number().positive().required()
});