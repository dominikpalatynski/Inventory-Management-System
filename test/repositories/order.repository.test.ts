import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { OrderRepository } from '../../src/domain/repositories/order.repository';
import { Order } from '../../src/domain/models/order.model';
import { IOrderCreate } from '../../src/types/order.types';
import { createTestOrder, createTestOrderProduct } from '../utils/helpers/util';

describe('OrderRepository', () => {
  let mongoServer: MongoMemoryServer;
  let orderRepository: OrderRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    orderRepository = new OrderRepository();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const orderData = createTestOrder();
      const result = await orderRepository.create(orderData);

      expect(result.customerId).toBe(orderData.customerId);
      expect(result.products[0].name).toBe(orderData.products[0].name);
      expect(result.products[0].price).toBe(orderData.products[0].price);
      expect(result.products[0].quantity).toBe(orderData.products[0].quantity);
    });

    it('should throw DatabaseError on invalid data', async () => {
      const invalidData = {
        customerId: new mongoose.Types.ObjectId().toString(),
        products: [{id: '123456789012', description: 'Test Description', price: 100}]
      } as IOrderCreate;

      await expect(orderRepository.create(invalidData))
        .rejects
        .toThrow('Database operation \'create\' failed: Order validation failed: products.0.quantity: Path `quantity` is required., products.0.name: Path `name` is required.');
    });
  });

  describe('update', () => {
    it('should update order products', async () => {
      const order = await Order.create(createTestOrder());
      
      const updateData = {
        products: [createTestOrderProduct({
          name: 'Updated Product',
          quantity: 5
        })]
      };

      const result = await orderRepository.update(
        order.id.toString(),
        updateData
      );

      expect(result?.products[0].name).toBe('Updated Product');
      expect(result?.products[0].quantity).toBe(5);
    });
  });
});