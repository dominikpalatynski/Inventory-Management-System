import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { ProductCommandController } from '../../src/api/controllers/commands/product.commands';
import { CreateProductHandler } from '../../src/domain/commands/createProduct.command';
import { createTestProduct, createTestProductResult } from '../utils/helpers/util';
import { createMockCreateProductHandler, MockCreateProductHandler } from '../utils/mocks/handlers.mock';

describe('ProductCommandController', () => {
  let productCommandController: ProductCommandController;
  let mockCreateProductHandler: MockCreateProductHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockCreateProductHandler = createMockCreateProductHandler();

    Container.set(CreateProductHandler, mockCreateProductHandler);
    productCommandController = Container.get(ProductCommandController);

    mockRequest = {
      body: createTestProduct()
    };
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

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const createdProduct = createTestProductResult();
      mockCreateProductHandler.execute.mockResolvedValue(createdProduct);

      await productCommandController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCreateProductHandler.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createdProduct
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors using next middleware', async () => {
      const error = new Error('Test error');
      mockCreateProductHandler.execute.mockRejectedValue(error);

      await productCommandController.createProduct(
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