import { IProduct } from '../../types/product.types';
import { ProductRepository } from '../repositories/product.repository';
import { Service } from 'typedi';

@Service()
export class GetProductsHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<IProduct[]> {
    return await this.productRepository.findAll();
  }
}