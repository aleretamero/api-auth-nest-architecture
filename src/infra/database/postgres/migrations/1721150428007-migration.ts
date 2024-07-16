import { MigrationInterface, QueryRunner } from 'typeorm';
import { ID } from '@/common/helpers/id';
import { Role } from '@/modules/user/enums/role.enum';
import * as bcrypt from 'bcrypt';

export class Migration1721150428007 implements MigrationInterface {
  name?: string | undefined;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const superAdminValues = {
      id: ID.generate(),
      email: 'super_admin@email.com',
      password_hash: await bcrypt.hash('SuperAdmin#123', 10),
      roles: JSON.stringify([Role.SUPER_ADMIN, Role.ADMIN, Role.USER]),
      email_verified: true,
    };

    const adminValues = {
      id: ID.generate(),
      email: 'admin@email.com',
      password_hash: await bcrypt.hash('Admin#123', 10),
      roles: JSON.stringify([Role.ADMIN, Role.USER]),
      email_verified: true,
    };

    const userValues = {
      id: ID.generate(),
      email: 'user@email.com',
      password_hash: await bcrypt.hash('User#123', 10),
      roles: JSON.stringify([Role.USER]),
      email_verified: true,
    };

    await queryRunner.query(
      `INSERT INTO "users" (id, email, password_hash, roles, email_verified)
        VALUES
          ($1, $2, $3, $4, $5),
          ($6, $7, $8, $9, $10),
          ($11, $12, $13, $14, $15)
      `,
      // eslint-disable-next-line @typescript-eslint/no-array-constructor
      new Array().concat(
        Object.values(superAdminValues),
        Object.values(adminValues),
        Object.values(userValues),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE email = 'super_admin@email.com'`); // prettier-ignore
    await queryRunner.query(`DELETE FROM "users" WHERE email = 'admin@email.com'`); // prettier-ignore
    await queryRunner.query(`DELETE FROM "users" WHERE email = 'user@email.com'`); // prettier-ignore
  }
}
