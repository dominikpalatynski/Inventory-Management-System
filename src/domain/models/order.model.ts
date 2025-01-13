import mongoose, { Document } from 'mongoose';
import { IOrder } from '@/types/order.types';

const orderProductItemSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    maxLength: 50 
  },
  description: { 
    type: String, 
    required: true,
    maxLength: 50 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1 
  }
});

const orderSchema = new mongoose.Schema({
  customerId: { 
    type: String, 
    required: true 
  },
  products: [orderProductItemSchema],
}, {
  timestamps: true
});

export const Order = mongoose.model<IOrder & Document>('Order', orderSchema);