import { CreateProductHandler } from "../../../src/domain/commands/createProduct.command";
import { GetProductsHandler } from "../../../src/domain/queries/getProducts.query";
import { StockManagementHandler } from "../../../src/domain/commands/stockManagment.command";
import { CreateOrderHandler } from "../../../src/domain/commands/createOrder.command";
interface GetProductsHandlerOmit extends Omit<GetProductsHandler, 'productRepository'> {}

export interface MockGetProductsHandler extends jest.Mocked<GetProductsHandlerOmit> {}

export const createMockGetProductsHandler = () => {
  return {
    execute: jest.fn(),
  } as jest.Mocked<MockGetProductsHandler>;
};
  
interface CreateProductHandlerOmit extends Omit<CreateProductHandler, 'productRepository'> {}

export interface MockCreateProductHandler extends jest.Mocked<CreateProductHandlerOmit> {}

export const createMockCreateProductHandler = () => {
  return {
    execute: jest.fn()
  } as MockCreateProductHandler;
};

interface StockManagementHandlerOmit extends Omit<StockManagementHandler, 'productRepository'> {}

export interface MockStockManagementHandler extends jest.Mocked<StockManagementHandlerOmit> {}

export const createMockStockManagementHandler = () => {
  return {
    restock: jest.fn(),
    sell: jest.fn()
  } as MockStockManagementHandler;
};

interface CreateOrderHandlerOmit extends Omit<CreateOrderHandler, 'orderRepository'> {}

export interface MockCreateOrderHandler extends jest.Mocked<CreateOrderHandlerOmit> {}

export const createMockCreateOrderHandler = () => {
  return {
    execute: jest.fn()
  } as MockCreateOrderHandler;
};