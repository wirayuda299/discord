import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        messages: exception.getResponse(),
        error: true,
        code: exception.getStatus(),
      });
    } else if (exception instanceof ZodError) {
      return response.status(400).json({
        messages: 'Invalid data',
        error: true,
        code: 400,
      });
    } else {
      return response.status(500).json({
        code: 500,
        messages: exception.message,
        error: true,
      });
    }
  }
}
