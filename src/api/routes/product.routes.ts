import { Router } from 'express';
import { ProductCommandController } from '@/api/controllers/commands/product.commands';
import { ProductQueryController } from '@/api/controllers/queries/product.queries';
import { validateBody } from '@/api/middleware/validation';
import { createProductSchema } from '@/api/validators/product.validator';
import { StockCommandController } from '@/api/controllers/commands/stock.commands';
import { stockOperationSchema } from '@/api/validators/stock.validator';
import Container from 'typedi';

const router = Router();

const productCommandController = Container.get(ProductCommandController)
const productQueryController = Container.get(ProductQueryController)
const stockCommandController = Container.get(StockCommandController);


router.post('/', 
  validateBody(createProductSchema),
  productCommandController.createProduct.bind(productCommandController)
);

router.get('/',
  productQueryController.getProducts.bind(productQueryController)
);

router.post('/:id/restock',
  validateBody(stockOperationSchema),
  stockCommandController.restockProduct.bind(stockCommandController)
);

router.post('/:id/sell',
  validateBody(stockOperationSchema),
  stockCommandController.sellProduct.bind(stockCommandController)
);

export default router;