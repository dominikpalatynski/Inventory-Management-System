export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
  }

export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
  }

  export interface RestockProductDTO {
    quantity: number;
  }
  
  export interface SellProductDTO {
    quantity: number;
  }