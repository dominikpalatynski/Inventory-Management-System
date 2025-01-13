import { CreateOrderDTO, IOrder, OrderProductItem } from '@/types/order.types';
import { OrderRepository } from '@/domain/repositories/order.repository';
import { ProductRepository } from '@/domain/repositories/product.repository';
import { InsufficientStockError, InternalError, NotFoundError} from '@/types/error';
import { Service } from 'typedi';

@Service()
export class CreateOrderHandler {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(orderData: CreateOrderDTO): Promise<IOrder> {
    const productStockMap = new Map<string, number>();

    const order =
      await Promise.all(
        orderData.products.map(async (orderProduct) => {
          const product = await this.productRepository.findById(orderProduct.productId);
          if (!product) {
            throw new NotFoundError('product', orderProduct.productId);
          }
          if (product.stock < orderProduct.quantity) {
            throw new InsufficientStockError(product.id, orderProduct.quantity, product.stock);
          }
          productStockMap.set(product.id, product.stock - orderProduct.quantity);
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            quantity: orderProduct.quantity
          } as OrderProductItem;
        })
      )

    const orderCreated = await this.orderRepository.create({
      customerId: orderData.customerId,
      products: order
    });

    try {
      await Promise.all(
        Array.from(productStockMap.entries()).map(([productId, stock]) =>
          this.productRepository.update(productId, {stock: stock})
        )
      );

    } catch (error) {
        throw new InternalError(
            'Failed to update products stock after order creation',
            'STOCK_UPDATE_FAILED',
            {
              orderId: orderCreated.id,
              products: Array.from(productStockMap.entries()).map(([id, stock]) => ({ id, stock })),
              originalError: error instanceof Error ? error.message : 'Unknown error'
            }
          );
    }

    return orderCreated;
  }
}