import 'reflect-metadata';
import { Container } from 'typedi';
import { CreateOrderHandler } from '../../src/domain/commands/createOrder.command';
import { OrderRepository } from '../../src/domain/repositories/order.repository';
import { ProductRepository } from '../../src/domain/repositories/product.repository';
import { CreateOrderDTO, IOrder } from '../../src/types/order.types';
import { createMockOrderRepository, createMockProductRepository } from '../utils/mocks/repositories.mock';
import { createTestProductResult, createTestOrderProduct } from '../utils/helpers/util';

describe('CreateOrderHandler', () => {
  let createOrderHandler: CreateOrderHandler;
  let mockOrderRepository: jest.Mocked<OrderRepository>;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  const mockProduct = createTestProductResult();

  const mockOrderDTO: CreateOrderDTO = {
    customerId: 'customer-1',
    products: [{
      productId: mockProduct.id,
      quantity: 2
    }]
  };

  const mockOrderProduct = createTestOrderProduct({
    id: mockProduct.id,
    name: mockProduct.name,
    price: mockProduct.price,
    description: mockProduct.description,
    quantity: mockOrderDTO.products[0].quantity
  });

  const mockOrder: IOrder = {
    id: 'order-1',
    customerId: mockOrderDTO.customerId,
    products: [mockOrderProduct]
  };

  beforeEach(() => {
    mockOrderRepository = createMockOrderRepository();
    mockProductRepository = createMockProductRepository();

    Container.set(OrderRepository, mockOrderRepository);
    Container.set(ProductRepository, mockProductRepository);
    createOrderHandler = Container.get(CreateOrderHandler);
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create order and update product stock successfully', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockOrderRepository.create.mockResolvedValue(mockOrder);
      mockProductRepository.update.mockResolvedValue({ ...mockProduct, stock: 8 });

      const result = await createOrderHandler.execute(mockOrderDTO);

      expect(result).toEqual(mockOrder);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(mockProduct.id);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        customerId: mockOrderDTO.customerId,
        products: [mockOrderProduct]
      });
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        mockProduct.id,
        { stock: 8 }
      );
    });

    it('should handle multiple products in order', async () => {
      const secondProduct = createTestProductResult({ 
        id: 'product-2', 
        name: 'Second Product',
        description: 'Second Description',
        price: 200,
        stock: 5
      });

      const multiProductOrderDTO: CreateOrderDTO = {
        customerId: 'customer-1',
        products: [
          { productId: mockProduct.id, quantity: 2 },
          { productId: secondProduct.id, quantity: 3 }
        ]
      };

      mockProductRepository.findById
        .mockImplementation(async (id) => 
          id === mockProduct.id ? mockProduct : secondProduct
        );

      const multiProductOrder: IOrder = {
        id: 'order-1',
        customerId: 'customer-1',
        products: [
          mockOrderProduct,
          createTestOrderProduct({
            id: secondProduct.id,
            name: secondProduct.name,
            price: secondProduct.price,
            description: secondProduct.description,
            quantity: 3
          })
        ]
      };

      mockOrderRepository.create.mockResolvedValue(multiProductOrder);

      await createOrderHandler.execute(multiProductOrderDTO);

      expect(mockProductRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockProductRepository.update).toHaveBeenCalledTimes(2);
      expect(mockProductRepository.update).toHaveBeenCalledWith(mockProduct.id, { stock: 8 });
      expect(mockProductRepository.update).toHaveBeenCalledWith(secondProduct.id, { stock: 2 });
    });

    it('should throw BusinessError when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(createOrderHandler.execute(mockOrderDTO))
        .rejects
        .toThrow(`product with id ${mockOrderDTO.products[0].productId} not found`);
    });

    it('should throw BusinessError when insufficient stock', async () => {
      const lowStockProduct = { ...mockProduct, stock: 1 };
      mockProductRepository.findById.mockResolvedValue(lowStockProduct);

      await expect(createOrderHandler.execute(mockOrderDTO))
        .rejects
        .toThrow('Insufficient stock');
    });

    it('should throw InternalError when stock update fails', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockOrderRepository.create.mockResolvedValue(mockOrder);
      mockProductRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(createOrderHandler.execute(mockOrderDTO))
        .rejects
        .toThrow('Failed to update products stock after order creation');
    });
  });
});