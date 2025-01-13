import { Router } from 'express';
import { OrderCommandController } from '@/api/controllers/commands/order.commands';
import { validateBody } from '@/api/middleware/validation';
import { createOrderSchema } from '@/api/validators/order.validator';
import Container from 'typedi';

const router = Router();

const orderCommandController = Container.get(OrderCommandController);

router.post('/',
  validateBody(createOrderSchema),
  orderCommandController.createOrder.bind(orderCommandController)
);

export default router;
