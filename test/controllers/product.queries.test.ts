import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { ProductQueryController } from '../../src/api/controllers/queries/product.queries';
import { GetProductsHandler } from '../../src/domain/queries/getProducts.query';
import { createTestProductsResults } from '../utils/helpers/util';
import { createMockGetProductsHandler, MockGetProductsHandler } from '../utils/mocks/handlers.mock';

describe('ProductQueryController', () => {
  let productQueryController: ProductQueryController;
  let mockGetProductsHandler: MockGetProductsHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockGetProductsHandler = createMockGetProductsHandler()

    Container.set(GetProductsHandler, mockGetProductsHandler);
    productQueryController = Container.get(ProductQueryController);

    mockRequest = {};
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

  describe('getProducts', () => {
    it('should return products successfully', async () => {
      const mockProducts = createTestProductsResults(2);
      mockGetProductsHandler.execute.mockResolvedValue(mockProducts);

      await productQueryController.getProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockProducts
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors using next middleware', async () => {
      const error = new Error('Test error');
      mockGetProductsHandler.execute.mockRejectedValue(error);

      await productQueryController.getProducts(
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