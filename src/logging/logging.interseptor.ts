import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body } = request;

    const startTime = Date.now();

    this.logger.logRequest(method, url, query, body);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;

          this.logger.logResponse(method, url, statusCode);

          if (statusCode >= 400) {
            this.logger.error(
              `Request failed with status ${statusCode} | Response body: ${JSON.stringify(data)}`,
              undefined,
              'HTTP',
            );
          }
        },
        error: (err) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode || 500;
          const duration = Date.now() - startTime;

          this.logger.error(
            `Request error | Method: ${method} | URL: ${url} | Status: ${statusCode} | Duration: ${duration}ms`,
            err.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}
