import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: Logger) { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    let metadata: any;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: string[] | undefined = undefined;
    let stack: string | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const { message: msg, error } = res as any;

        if (Array.isArray(msg)) {
          message = "Validation failed"
          errors = msg;
        } else {
          message = msg || error || 'Bad Request';
        }
      } else if (typeof res === 'string') {
        message = res;
      }
    }

    const responseTime = (request as any).raw?.startTime
      ? Date.now() - (request as any).raw.startTime
      : 0;

    this.logger.error(
      {
        method: request.method,
        url: request.url,
        status,
        message,
        stack,
        user: (request as any).user?.id,
        responseTime,
        ...(metadata ? { metadata } : {}),
      },
      `Exception caught: ${message}`
    );

    response.status(status).send({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
