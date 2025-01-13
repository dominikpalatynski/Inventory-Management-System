import dotenv from 'dotenv';
import path from 'path';
import { IEnvironmentConfig } from '@/types/config';

dotenv.config({ 
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env') 
});

export const config: IEnvironmentConfig = {
  node: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
  },
  database: {
    url: process.env.MONGODB_URI!,
  },
};

const requiredEnvs = ['MONGODB_URI', 'PORT', 'NODE_ENV'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
}

export default config;