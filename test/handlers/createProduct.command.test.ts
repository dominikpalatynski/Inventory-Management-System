import 'reflect-metadata';
import { Container } from 'typedi';
import { CreateProductHandler } from '../../src/domain/commands/createProduct.command';
import { ProductRepository } from '../../src/domain/repositories/product.repository';
import { IProduct } from '../../src/types/product.types';
import { createTestProduct } from '../utils/helpers/util';
import { createMockProductRepository } from '../utils/mocks/repositories.mock';

describe('CreateProductHandler', () => {
  let createProductHandler: CreateProductHandler;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = createMockProductRepository();

    Container.set(ProductRepository, mockProductRepository);
    createProductHandler = Container.get(CreateProductHandler);
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new product successfully', async () => {
      const productData = createTestProduct();
      const expectedProduct = { 
        id: '123',
        ...productData 
      } as IProduct;

      mockProductRepository.create.mockResolvedValue(expectedProduct);

      const result = await createProductHandler.execute(productData);

      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith(productData);
      expect(mockProductRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails', async () => {
      const productData = createTestProduct();
      const error = new Error('Database error');

      mockProductRepository.create.mockRejectedValue(error);

      await expect(createProductHandler.execute(productData))
        .rejects
        .toThrow('Database error');
      
      expect(mockProductRepository.create).toHaveBeenCalledWith(productData);
    });
  });
});