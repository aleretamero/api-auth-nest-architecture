import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';

@Injectable({ scope: Scope.REQUEST })
export class TypeormMiddleware implements NestMiddleware {
  constructor(
    private readonly dataSource: DataSource,
    private readonly typeormService: TypeormService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    req.QUERY_RUNNER = queryRunner;
    req.ENTITY_MANAGER = queryRunner.manager;

    this.typeormService['$queryRunner'] = queryRunner;

    next();
  }
}
