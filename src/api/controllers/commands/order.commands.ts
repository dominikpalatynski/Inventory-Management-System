import { Request, Response, NextFunction } from 'express';
import { CreateOrderHandler } from '@/domain/commands/createOrder.command';
import { CreateOrderDTO } from '@/types/order.types';
import { Service } from 'typedi';

@Service()
export class OrderCommandController {
  constructor(private createOrderHandler: CreateOrderHandler) {}

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderData: CreateOrderDTO = req.body;
      const order = await this.createOrderHandler.execute(orderData);
      
      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }
}