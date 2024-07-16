import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1721150011858 implements MigrationInterface {
  name = 'Migration1721150011858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sessions" (
        "device_identifier" character varying NOT NULL,
        "user_id" character varying NOT NULL,
        "access_token" character varying NOT NULL,
        "refresh_token" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_c2795690e9c26841e199186b6a0" PRIMARY KEY ("device_identifier", "user_id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_codes" (
        "id" character varying NOT NULL,
        "user_id" character varying NOT NULL,
        "type" smallint NOT NULL,
        "status" smallint NOT NULL DEFAULT '1',
        "code" character varying NOT NULL,
        "expires_in" bigint NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_fc6ab0a548a92dce63e7e98c84e" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "personal_data" (
        "id" character varying NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "date_of_birth" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" character varying NOT NULL,
        "userId" character varying,

        CONSTRAINT "REL_f9806706370e043fd63608ef9d" UNIQUE ("userId"),
        CONSTRAINT "PK_1e2cf868aa2878d017400387a89" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "avatar_path" character varying,
        "avatar_url" character varying,
        "email_verified" boolean NOT NULL DEFAULT false,
        "roles" json NOT NULL DEFAULT '[0]',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions"
        ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"
        FOREIGN KEY ("user_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_codes"
        ADD CONSTRAINT "FK_b98f6d82aa9b218599917bf21b3"
        FOREIGN KEY ("user_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "personal_data"
        ADD CONSTRAINT "FK_f9806706370e043fd63608ef9da"
        FOREIGN KEY ("userId")
        REFERENCES "users"("id")
        ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "personal_data" DROP CONSTRAINT "FK_f9806706370e043fd63608ef9da"`); // prettier-ignore
    await queryRunner.query(`ALTER TABLE "user_codes" DROP CONSTRAINT "FK_b98f6d82aa9b218599917bf21b3"`); // prettier-ignore
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`); // prettier-ignore
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "personal_data"`);
    await queryRunner.query(`DROP TABLE "user_codes"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}
