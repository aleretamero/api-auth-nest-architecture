import { MongoService } from '@/infra/database/mongo/mongo-service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LoggingErrorInterceptor implements NestInterceptor {
  private logger = new Logger('ErrorInterceptor');

  constructor(private readonly mongoService: MongoService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (error) => {
        const request = ctx.switchToHttp().getRequest();

        const statusCode = error.status ?? error.statusCode;

        const log = await this.mongoService.errorLogModel.create({
          method: request.method,
          url: request.url,
          statusCode: statusCode,
          errorMessage: error.message,
          userId: request.user?.id,
          stack: error.stack,
          requestHeaders: JSON.stringify(request.headers, null, 2),
          requestBody: JSON.stringify(request.body, null, 2),
          timestamp: new Date().toISOString(),
        });

        this.logger.error(
          `ID: ${log.id} | Status Code: ${statusCode} | Error: ${error.message}`,
        );

        throw error;
      }),
    );
  }
}
