import mongoose from 'mongoose';
import config from '@/config/environment';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.url);
    console.log('🌿 MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
