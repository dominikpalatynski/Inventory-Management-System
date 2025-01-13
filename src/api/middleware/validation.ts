import { ValidationError } from '@/types/error';
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

const formatValidationErrors = (details: any[]): Record<string, string> => {
    return details.reduce((acc, detail) => {
      const path = detail.path.join('.');
      acc[path] = detail.message.replace(/['"]/g, '');
      return acc;
    }, {} as Record<string, string>);
  };

export const validateBody = (schema: Schema) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      
    if (error) {
      throw new ValidationError('Invalid request body', { error: formatValidationErrors(error.details) });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateParams = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error } = schema.validate(req.params, { abortEarly: false });
        
        if (error) {

          throw new ValidationError('Request parameters validation failed', formatValidationErrors(error.details));
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
