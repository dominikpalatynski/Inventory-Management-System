import { ProductRepository } from '@/domain/repositories/product.repository';
import { RestockProductDTO, SellProductDTO, IProduct } from '@/types/product.types';
import { NotFoundError, InsufficientStockError } from '@/types/error';
import { Service } from 'typedi';

@Service()
export class StockManagementHandler {
  constructor(private productRepository: ProductRepository) {}

  async restock(productId: string, data: RestockProductDTO): Promise<IProduct> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('product', productId);
    }

    product.stock += data.quantity;
    const updatedProduct = await this.productRepository.update(productId, { stock: product.stock });
    if (!updatedProduct) {
        throw new NotFoundError('product', productId);
    }
  
    return updatedProduct;
  }

  async sell(productId: string, data: SellProductDTO): Promise<IProduct> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
        throw new NotFoundError('product', productId);
    }
    
    if (product.stock < data.quantity) {
        throw new InsufficientStockError(productId, data.quantity, product.stock);
    
    }

    product.stock -= data.quantity;
    const updatedProduct = await this.productRepository.update(productId, { stock: product.stock });
    if (!updatedProduct) {
        throw new NotFoundError('product', productId);
    }
  
    return updatedProduct;
  }
}