import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { OrderCommandController } from '../../src/api/controllers/commands/order.commands';
import { CreateOrderHandler } from '../../src/domain/commands/createOrder.command';
import { createTestOrder, createTestOrderProduct } from '../utils/helpers/util';
import { createMockCreateOrderHandler } from '../utils/mocks/handlers.mock';
import { MockCreateOrderHandler } from '../utils/mocks/handlers.mock';
import { OrderProductItem } from '../../src/types/order.types';

describe('OrderCommandController', () => {
  let orderCommandController: OrderCommandController;
  let mockCreateOrderHandler: MockCreateOrderHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockCreateOrderHandler = createMockCreateOrderHandler();

    Container.set(CreateOrderHandler, mockCreateOrderHandler);
    orderCommandController = Container.get(OrderCommandController);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    beforeEach(() => {
      mockRequest = {
        body: createTestOrder()
      };
    });

    it('should create order successfully', async () => {
      const createdOrder = {
        id: 'order-1',
        customerId: mockRequest.body.customerId,
        products: mockRequest.body.products.map((product: OrderProductItem) => createTestOrderProduct(product))
      };
      mockCreateOrderHandler.execute.mockResolvedValue(createdOrder);

      await orderCommandController.createOrder(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCreateOrderHandler.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createdOrder
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors using next middleware', async () => {
      const error = new Error('Create order error');
      mockCreateOrderHandler.execute.mockRejectedValue(error);

      await orderCommandController.createOrder(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});