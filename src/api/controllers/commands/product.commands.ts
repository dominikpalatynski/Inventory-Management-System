import { Request, Response, NextFunction } from 'express';
import {CreateProductHandler } from '@/domain/commands/createProduct.command';
import { CreateProductDTO } from '@/types/product.types';
import { Service } from 'typedi';

@Service()
export class ProductCommandController {
  constructor(private createProductHandler: CreateProductHandler) {}

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productData: CreateProductDTO = req.body;
      const product = await this.createProductHandler.execute(productData);
      
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }
}