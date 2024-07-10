import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors = ['Internal Server Error'];

    if (exception instanceof HttpException) {
      const errorsResponse = (exception.getResponse() as any).message;

      statusCode = exception.getStatus();
      message = exception.name;
      errors = Array.isArray(errorsResponse)
        ? errorsResponse
        : [errorsResponse];
    } else if (exception instanceof Error) {
      message = exception.name;
      errors = [exception.message];
    }

    response.status(statusCode).json({
      statusCode,
      message,
      errors,
    });
  }
}
