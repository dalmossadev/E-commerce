import { AppError } from '@core/errors/AppError';

export class NotFoundError extends AppError {
  name = 'NotFoundError' as const;
  constructor(resource: string, id?: number | string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  name = 'UnauthorizedError' as const;
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  name = 'ForbiddenError' as const;
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  name = 'ValidationError' as const;
  constructor(message: string) {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  name = 'ConflictError' as const;
  constructor(resource: string) {
    super(`${resource} already exists`, 409);
  }
}

export class BadRequestError extends AppError {
  name = 'BadRequestError' as const;
  constructor(message: string) {
    super(message, 400);
  }
}

export class InternalServerError extends AppError {
  name = 'InternalServerError' as const;
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}