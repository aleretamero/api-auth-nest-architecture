import { User } from '@/modules/user/entities/user.entity';
import { EntityManager, QueryRunner } from 'typeorm';

declare global {
  export namespace Express {
    export interface Request {
      QUERY_RUNNER?: QueryRunner;
      ENTITY_MANAGER?: EntityManager;
      user?: User;
    }
  }
}
