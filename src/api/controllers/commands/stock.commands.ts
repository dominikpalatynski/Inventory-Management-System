import { Request, Response, NextFunction } from 'express';
import { StockManagementHandler } from '@/domain/commands/stockManagment.command';
import { Service } from 'typedi';

@Service()
export class StockCommandController {
  constructor(private stockManagementHandler: StockManagementHandler) {}

  async restockProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      const product = await this.stockManagementHandler.restock(id, { quantity });
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
        next(error);
    }
  }

  async sellProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      const product = await this.stockManagementHandler.sell(id, { quantity });
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }
}