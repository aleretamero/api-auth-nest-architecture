import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720900512114 implements MigrationInterface {
    name = 'Migration1720900512114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sessions" ("device_identifier" character varying NOT NULL, "user_id" character varying NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "SESSION_PK" PRIMARY KEY ("device_identifier", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "user_codes" ("id" character varying NOT NULL, "user_id" character varying NOT NULL, "type" smallint NOT NULL, "status" smallint NOT NULL DEFAULT '1', "code" character varying NOT NULL, "expires_in" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "USER_CODE_PK" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users/personal_data" ("id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, CONSTRAINT "PERSONAL_DATA_USER_UK" UNIQUE ("user_id"), CONSTRAINT "REL_3fa251bd690be54c1731953cf9" UNIQUE ("user_id"), CONSTRAINT "PERSONAL_DATA_PK" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "avatar_path" character varying, "avatar_url" character varying, "email_verified" boolean NOT NULL DEFAULT false, "roles" json NOT NULL DEFAULT '[0]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "USER_EMAIL_UK" UNIQUE ("email"), CONSTRAINT "USER_PK" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "SESSION_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "user_codes" ADD CONSTRAINT "USER_CODE_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "users/personal_data" ADD CONSTRAINT "PERSONAL_DATA_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users/personal_data" DROP CONSTRAINT "PERSONAL_DATA_USER_FK"`);
        await queryRunner.query(`ALTER TABLE "user_codes" DROP CONSTRAINT "USER_CODE_USER_FK"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "SESSION_USER_FK"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "users/personal_data"`);
        await queryRunner.query(`DROP TABLE "user_codes"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
    }

}
