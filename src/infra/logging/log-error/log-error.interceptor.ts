import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogErrorService } from '@/infra/logging/log-error/log-error.service';

@Injectable()
export class LogErrorInterceptor implements NestInterceptor {
  private logger = new Logger('ErrorInterceptor');

  constructor(private readonly logErrorService: LogErrorService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (error) => {
        const request = ctx.switchToHttp().getRequest();

        const statusCode = error.status ?? error.statusCode;

        const log = await this.logErrorService.create({
          method: request.method,
          url: request.url,
          statusCode: statusCode,
          errorMessage: error.message,
          userId: request.user?.id,
          stack: error.stack,
          requestHeaders: request.headers,
          requestBody: request.body,
        });

        this.logger.error(
          `ID: ${log.id} | Status Code: ${statusCode} | Error: ${error.message}`,
        );

        throw error;
      }),
    );
  }
}
