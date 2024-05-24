import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException, NotFoundException, BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).send({
        messages: exception.getResponse(),
        error: true,
        code: exception.getStatus(),
      });
    } else if (
      exception instanceof ZodError ||
      exception instanceof BadRequestException
    ) {
      return response.status(400).send({
        messages: 'Invalid data',
        error: true,
        code: 400,
      });
    } else if (exception instanceof NotFoundException) {
      return response.status(404).send({
        code: 404,
        messages: exception.message,
        error: true,
      });
    } else {
      return response.status(500).send({
        code: 500,
        messages: exception.message,
        error: true,
      });
    }
  }
}
