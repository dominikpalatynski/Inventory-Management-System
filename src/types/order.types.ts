export interface OrderItemDTO {
    productId: string;
    quantity: number;
  }
  
  export interface CreateOrderDTO {
    customerId: string;
    products: OrderItemDTO[];
  }
  
  export interface OrderProductItem {
    id: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
  }
  
  export interface IOrderCreate {
    customerId: string;
    products: OrderProductItem[];
  }

  export interface IOrder {
    id: string;
    customerId: string;
    products: OrderProductItem[];
  }