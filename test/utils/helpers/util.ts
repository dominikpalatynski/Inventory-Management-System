import { OrderProductItem } from "../../../src/types/order.types";
import { IOrderCreate } from "../../../src/types/order.types";
import mongoose from "mongoose";
import { CreateProductDTO, IProduct } from "../../../src/types/product.types";
import { OrderRepository } from "../../../src/domain/repositories/order.repository";
import { ProductRepository } from "../../../src/domain/repositories/product.repository";

export const createTestOrderProduct = (override: Partial<OrderProductItem> = {}): OrderProductItem => ({
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Test Product',
    price: 100,
    description: 'Test Description',
    quantity: 2,
    ...override
  });
  
export const createTestOrder = (override: Partial<IOrderCreate> = {}): IOrderCreate => ({
    customerId: new mongoose.Types.ObjectId().toString(),
    products: [createTestOrderProduct()],
    ...override
  });

export const createTestProduct = (override: Partial<CreateProductDTO> = {}): CreateProductDTO => ({
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 10,
    ...override
  });

export const createTestProducts = (count: number): CreateProductDTO[] => {
    return Array.from({ length: count }, (_, index) => ({
      name: `Test Product ${index + 1}`,
      description: `Test Description ${index + 1}`,
      price: 100 * (index + 1),
      stock: 10 * (index + 1)
    }));
  };

  export const createTestProductResult = (override: Partial<IProduct> = {}): IProduct => ({
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override
  });
  
  export const createTestProductsResults = (count: number): IProduct[] => {
    return Array.from({ length: count }, (_, index) => 
      createTestProductResult({
        name: `Test Product ${index + 1}`,
        description: `Test Description ${index + 1}`,
        price: 100 * (index + 1),
        stock: 10 * (index + 1)
      })
    );
  };