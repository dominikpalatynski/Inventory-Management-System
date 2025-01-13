import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { StockCommandController } from '../../src/api/controllers/commands/stock.commands';
import { StockManagementHandler } from '../../src/domain/commands/stockManagment.command';
import { createTestProductResult } from '../utils/helpers/util';
import { createMockStockManagementHandler, MockStockManagementHandler } from '../utils/mocks/handlers.mock';

describe('StockCommandController', () => {
  let stockCommandController: StockCommandController;
  let mockStockManagementHandler: MockStockManagementHandler;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockStockManagementHandler = createMockStockManagementHandler();

    Container.set(StockManagementHandler, mockStockManagementHandler);
    stockCommandController = Container.get(StockCommandController);

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

  describe('restockProduct', () => {
    beforeEach(() => {
      mockRequest = {
        params: { id: 'product-1' },
        body: { quantity: 5 }
      };
    });

    it('should restock product successfully', async () => {
      const updatedProduct = createTestProductResult({ stock: 15 });
      mockStockManagementHandler.restock.mockResolvedValue(updatedProduct);

      await stockCommandController.restockProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStockManagementHandler.restock).toHaveBeenCalledWith('product-1', { quantity: 5 });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedProduct
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle restock errors using next middleware', async () => {
      const error = new Error('Restock error');
      mockStockManagementHandler.restock.mockRejectedValue(error);

      await stockCommandController.restockProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('sellProduct', () => {
    beforeEach(() => {
      mockRequest = {
        params: { id: 'product-1' },
        body: { quantity: 3 }
      };
    });

    it('should sell product successfully', async () => {
      const updatedProduct = createTestProductResult({ stock: 7 });
      mockStockManagementHandler.sell.mockResolvedValue(updatedProduct);

      await stockCommandController.sellProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStockManagementHandler.sell).toHaveBeenCalledWith('product-1', { quantity: 3 });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedProduct
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle sell errors using next middleware', async () => {
      const error = new Error('Sell error');
      mockStockManagementHandler.sell.mockRejectedValue(error);

      await stockCommandController.sellProduct(
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