import { OrderRepository } from "../../../src/domain/repositories/order.repository";
import { ProductRepository } from "../../../src/domain/repositories/product.repository";

export const createMockOrderRepository = () => ({
    create: jest.fn(),
    update: jest.fn()
  }) as jest.Mocked<OrderRepository>;
  
  export const createMockProductRepository = () => ({
    findById: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
  }) as jest.Mocked<ProductRepository>; 