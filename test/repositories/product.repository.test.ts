import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ProductRepository } from '../../src/domain/repositories/product.repository';
import { CreateProductDTO } from '../../src/types/product.types';
import { Product } from '../../src/domain/models/product.model';
import { createTestProduct, createTestProducts } from '../utils/helpers/util';

describe('ProductRepository', () => {
  let mongoServer: MongoMemoryServer;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    productRepository = new ProductRepository();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = createTestProduct()
      const result = await productRepository.create(productData);

      expect(result.name).toBe(productData.name);
      expect(result.price).toBe(productData.price);
      expect(result.stock).toBe(productData.stock);
    });

    it('should throw DatabaseError on invalid data', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100
      } as CreateProductDTO;

      await expect(productRepository.create(invalidData))
        .rejects
        .toThrow('Database operation \'create\' failed: Product validation failed: stock: Path `stock` is required.');
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = createTestProducts(2)

      await Product.insertMany(products);

      const result = await productRepository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe(products[0].name);
      expect(result[1].name).toBe(products[1].name);
    });
  });

  describe('findById', () => {
    it('should return product by id', async () => {
      const product = await Product.create(createTestProduct());

      const result = await productRepository.findById(product.id.toString());

      expect(result?.name).toBe(product.name);
    });

    it('should return null for non-existent id', async () => {
      const result = await productRepository.findById("6782407e9ef8be2a088d03f9");
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const product = await Product.create(createTestProduct());

      const updatedProduct =  createTestProduct({name: 'Updated Product', price: 200})

      const result = await productRepository.update(
        product.id.toString(),
        updatedProduct
      );

      expect(result?.name).toBe(updatedProduct.name);
      expect(result?.price).toBe(updatedProduct.price);
      expect(result?.stock).toBe(product.stock);
    });
  });
});