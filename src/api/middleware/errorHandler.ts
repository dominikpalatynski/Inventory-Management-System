import { ErrorRequestHandler } from 'express';
import { AppError, InternalError } from '@/types/error';
import config from '@/config/environment';

export const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
    if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toResponse());
    return;
    }

    if (err instanceof InternalError) {
    res.status(500).json({
        status: 'error',
        code: err.code,
        message: 'Internal server error',
        details: config.node.env === 'development' ? err.details : undefined
    });
    return;
    }

  console.error('Error:', err);
  res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'Internal server error'
  });
};