import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  DomainErrorCode,
} from 'src/shared/domain/exceptions/domain.exception';

const STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  [DomainErrorCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.CONFLICT]: HttpStatus.CONFLICT,
  [DomainErrorCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [DomainErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
};

/**
 * Translates DomainExceptions into HTTP responses with appropriate status codes and messages.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode =
      STATUS_BY_CODE[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      statusCode,
      message: exception.message,
      ...(exception.field ? { field: exception.field } : {}),
    });
  }
}
