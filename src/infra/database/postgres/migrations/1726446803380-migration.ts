import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1726446803380 implements MigrationInterface {
  name = 'Migration1726446803380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "personal_data" DROP CONSTRAINT "FK_f9806706370e043fd63608ef9da"`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_2fa" ("id" character varying NOT NULL, "secret" character varying, "temp_secret" character varying, "temp_secret_expiry" bigint, "is_enabled" boolean NOT NULL DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, "user_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_ed539980faac14226a05368c4d" UNIQUE ("user_id"), CONSTRAINT "PK_63a194aa64b4e2039a535a9aa9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "personal_data" DROP CONSTRAINT "REL_f9806706370e043fd63608ef9d"`,
    );
    await queryRunner.query(`ALTER TABLE "personal_data" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "personal_data" ADD CONSTRAINT "UQ_78ca212d8f4f2679c9c5985269a" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "personal_data" ADD CONSTRAINT "FK_78ca212d8f4f2679c9c5985269a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_2fa" ADD CONSTRAINT "FK_ed539980faac14226a05368c4d1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_2fa" DROP CONSTRAINT "FK_ed539980faac14226a05368c4d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "personal_data" DROP CONSTRAINT "FK_78ca212d8f4f2679c9c5985269a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "personal_data" DROP CONSTRAINT "UQ_78ca212d8f4f2679c9c5985269a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "personal_data" ADD "userId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "personal_data" ADD CONSTRAINT "REL_f9806706370e043fd63608ef9d" UNIQUE ("userId")`,
    );
    await queryRunner.query(`DROP TABLE "user_2fa"`);
    await queryRunner.query(
      `ALTER TABLE "personal_data" ADD CONSTRAINT "FK_f9806706370e043fd63608ef9da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`,
    );
  }
}
