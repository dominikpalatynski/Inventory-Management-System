import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '@/config/environment';
import productRoutes from '@/api/routes/product.routes';
import { connectDB } from '@/config/database';
import orderRoutes from '@/api/routes/order.routes';
import { errorHandler } from '@/api/middleware/errorHandler';
const app = express();
connectDB();
// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

app.listen(config.node.port, () => {
  console.log(`server is running on http://localhost:${config.node.port}`);
});

app.use(errorHandler);
export default app;
