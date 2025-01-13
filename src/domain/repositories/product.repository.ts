import { Product } from '../models/product.model';
import { CreateProductDTO } from '../../types/product.types';
import { IProduct } from '../../types/product.types';
import { DatabaseError } from '../../types/error';
import { Service } from 'typedi';

@Service()
export class ProductRepository {
  async create(data: CreateProductDTO): Promise<IProduct> {
    const product = new Product(data);
    try {
      return await product.save();
    } catch (error: unknown) {
      throw new DatabaseError('create', error as Error, { collection: 'products', data });
    }
  }

  async findAll(): Promise<IProduct[]> {
    try {
      return await Product.find();
    } catch (error: unknown) {
      throw new DatabaseError('findAll', error as Error, { collection: 'products'});
    }
  }

  async findById(id: string): Promise<IProduct | null> {
    try {
      return await Product.findById(id);
    } catch (error: unknown) {
      throw new DatabaseError('findById', error as Error, { collection: 'products', id });
    }
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    try {
      return await Product.findByIdAndUpdate(id, data, { new: true });
    } catch (error: unknown) {
      throw new DatabaseError('findByIdAndUpdate', error as Error, { collection: 'products', id });
    }
  }
}