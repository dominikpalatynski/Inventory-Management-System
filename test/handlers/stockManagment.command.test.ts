import 'reflect-metadata';
import { Container } from 'typedi';
import { StockManagementHandler } from '../../src/domain/commands/stockManagment.command';
import { ProductRepository } from '../../src/domain/repositories/product.repository';
import { IProduct } from '../../src/types/product.types';
import { createTestProduct } from '../utils/helpers/util';
import { createMockProductRepository } from '../utils/mocks/repositories.mock';
describe('StockManagementHandler', () => {
  let stockManagementHandler: StockManagementHandler;   
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = createMockProductRepository();

    Container.set(ProductRepository, mockProductRepository);
    stockManagementHandler = Container.get(StockManagementHandler);
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  describe('restock', () => {
    it('should increase product stock', async () => {
      const productId = '123';
      const initialProduct = createTestProduct({ stock: 10 }) as IProduct;
      const restockQuantity = 5;

      mockProductRepository.findById.mockResolvedValue(initialProduct);
      mockProductRepository.update.mockResolvedValue({
        ...initialProduct,
        stock: initialProduct.stock + restockQuantity
      } as IProduct);

      const result = await stockManagementHandler.restock(productId, { quantity: restockQuantity });

      expect(result.stock).toBe(15);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, { stock: 15 });
    });

    it('should throw error when product not found', async () => {
      const productId = '123';
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(stockManagementHandler.restock(productId, { quantity: 5 }))
        .rejects
        .toThrow(`product with id ${productId} not found`);
    });
  });

  describe('sell', () => {
    it('should decrease product stock', async () => {
      const productId = '123';
      const initialProduct = createTestProduct({ stock: 10 }) as IProduct;
      const sellQuantity = 3;

      mockProductRepository.findById.mockResolvedValue(initialProduct);
      mockProductRepository.update.mockResolvedValue({
        ...initialProduct,
        stock: initialProduct.stock - sellQuantity
      } as IProduct);

      const result = await stockManagementHandler.sell(productId, { quantity: sellQuantity });

      expect(result.stock).toBe(7);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, { stock: 7 });
    });

    it('should throw error when insufficient stock', async () => {
      const productId = '123';
      const initialProduct = createTestProduct({ stock: 5 }) as IProduct;
      
      mockProductRepository.findById.mockResolvedValue(initialProduct);

      await expect(stockManagementHandler.sell(productId, { quantity: 10 }))
        .rejects
        .toThrow('Insufficient stock');
    });

    it('should throw error when product not found', async () => {
      const productId = '123';
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(stockManagementHandler.sell(productId, { quantity: 5 }))
        .rejects
        .toThrow(`product with id ${productId} not found`);
    });
  });
});