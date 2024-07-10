import { Session } from '@/modules/user/sub-modules/session/entities/session.entity';
import { UserCode } from '@/modules/user/sub-modules/user-code/entities/user-code.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Injectable, Scope } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TypeormService {
  private _queryRunner: QueryRunner | null = null;
  public get $queryRunner(): QueryRunner {
    if (!this._queryRunner) {
      throw new Error('Query runner is not initialized');
    }

    return this._queryRunner;
  }
  public set $queryRunner(value) {
    this._queryRunner = value;
    this.entityManager = value?.manager ?? null;
  }

  private entityManager: EntityManager | null = null;
  public get $entityManager(): EntityManager {
    if (!this.entityManager) {
      throw new Error('Entity manager is not initialized');
    }

    return this.entityManager;
  }

  get $query() {
    return this.$queryRunner.query.bind(this.$queryRunner);
  }

  get user(): Repository<User> {
    return this.$entityManager.getRepository(User);
  }

  get session(): Repository<Session> {
    return this.$entityManager.getRepository(Session);
  }

  get userCode(): Repository<UserCode> {
    return this.$entityManager.getRepository(UserCode);
  }
}
