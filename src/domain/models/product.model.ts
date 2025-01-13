import mongoose, { Document } from 'mongoose';
import { IProduct } from '@/types/product.types';

const productSchema = new mongoose.Schema({
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
  stock: { 
    type: Number, 
    required: true,
    min: 0 
  }
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct & Document>('Product', productSchema);