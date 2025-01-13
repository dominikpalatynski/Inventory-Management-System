
type ErrorResponse = {
  status: string;
  code: string;
  message: string;
  details?: Record<string, any>;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  public toResponse(): ErrorResponse {
    return {
      status: 'error',
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}
 
export class InternalError extends Error {
  constructor(
    public message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(
      `${resource} with id ${id} not found`,
      404,
      'RESOURCE_NOT_FOUND'
    );
  }
}

export class BusinessError extends AppError {
  constructor(message: string, code: string, details?: Record<string, any>) {
    super(message, 422, code, details);
  }
}

export class InsufficientStockError extends BusinessError {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}`,
      'INSUFFICIENT_STOCK',
      { productId, requested, available }
    );
  }
}

export class DatabaseError extends InternalError {
  constructor(operation: string, originalError: Error, details?: Record<string, any>) {
    super(
      `Database operation '${operation}' failed: ${originalError.message}`,
      'DATABASE_ERROR',
      {
        operation,
        originalError: originalError.message,
        ...details
      }
    );
  }
}