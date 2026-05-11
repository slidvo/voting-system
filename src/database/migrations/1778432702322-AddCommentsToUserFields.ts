import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsToUserFields1778432702322 implements MigrationInterface {
    name = 'AddCommentsToUserFields1778432702322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "users"."permissions" IS 'List of permissions granted to the user'`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."id" IS 'Unique identifier of the user'`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."name" IS 'Full name of the user'`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."email" IS 'Unique email address used for authentication'`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."password" IS 'Hashed password of the user'`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."createdAt" IS 'Timestamp when the user account was created'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "users"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."password" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."email" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."name" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."permissions" IS 'List of permissions granted to the user'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."users_permissions_enum"`);
    }

}
