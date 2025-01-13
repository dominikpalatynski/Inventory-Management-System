import { Order } from '../models/order.model';
import {IOrder, IOrderCreate } from '../../types/order.types';
import { DatabaseError } from '../../types/error';
import { Service } from 'typedi';

@Service()
export class OrderRepository {
  async create(data: IOrderCreate): Promise<IOrder> {
    try {
      const order = new Order(data);
      return await order.save();
    } catch (error: unknown) {
      throw new DatabaseError('create', error as Error, { collection: 'orders', data });
    }
  }

  async update(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndUpdate(id, data, { new: true });
    } catch (error: unknown) {
      throw new DatabaseError('findByIdAndUpdate', error as Error, { collection: 'orders', id });
    }
  }
}