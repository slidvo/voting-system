import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionsFieldToUser1778431740536 implements MigrationInterface {
    name = 'AddPermissionsFieldToUser1778431740536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_permissions_enum" AS ENUM('create_poll', 'update_poll', 'watch_poll', 'delete_poll')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "permissions" "public"."users_permissions_enum" array NOT NULL DEFAULT '{create_poll,watch_poll}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."users_permissions_enum"`);
    }

}
