import { Request } from 'express';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable, catchError, concatMap, finalize } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class TypeormInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // get request object
    const req = context.switchToHttp().getRequest<Request>();

    const queryRunner = req.QUERY_RUNNER;

    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        await queryRunner?.commitTransaction();
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        await queryRunner?.rollbackTransaction();
        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        await queryRunner?.release();
      }),
    );
  }
}
