import { CreateProductDTO, IProduct } from '@/types/product.types';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { Service } from 'typedi';

@Service()
export class CreateProductHandler {
  constructor(private productRepository: ProductRepository) {}

  async execute(createProductDTO: CreateProductDTO): Promise<IProduct> {
    return await this.productRepository.create(createProductDTO);
  }
}