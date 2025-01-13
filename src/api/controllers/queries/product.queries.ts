import { NextFunction, Request, Response } from 'express';
import { GetProductsHandler } from '@/domain/queries/getProducts.query';
import { Service } from 'typedi';

@Service()
export class ProductQueryController {
  constructor(private getProductsHandler: GetProductsHandler) {}

  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await this.getProductsHandler.execute();
      
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
        next(error);
    }
  }
}