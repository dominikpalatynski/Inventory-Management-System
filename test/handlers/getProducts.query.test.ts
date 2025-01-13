import 'reflect-metadata';
import { Container } from 'typedi';
import { GetProductsHandler } from '../../src/domain/queries/getProducts.query';
import { ProductRepository } from '../../src/domain/repositories/product.repository';
import { createMockProductRepository } from '../utils/mocks/repositories.mock';
import { createTestProductsResults } from '../utils/helpers/util';

describe('GetProductsHandler', () => {
  let getProductsHandler: GetProductsHandler;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = createMockProductRepository();
    Container.set(ProductRepository, mockProductRepository);
    getProductsHandler = Container.get(GetProductsHandler);
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all products', async () => {
      const mockProducts = createTestProductsResults(2);
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await getProductsHandler.execute();

      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      mockProductRepository.findAll.mockResolvedValue([]);

      const result = await getProductsHandler.execute();

      expect(result).toEqual([]);
      expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from repository', async () => {
      const error = new Error('Database error');
      mockProductRepository.findAll.mockRejectedValue(error);

      await expect(getProductsHandler.execute())
        .rejects
        .toThrow('Database error');
    });
  });
});