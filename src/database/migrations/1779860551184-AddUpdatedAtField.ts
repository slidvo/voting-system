import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtField1779860551184 implements MigrationInterface {
    name = 'AddUpdatedAtField1779860551184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "polls" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "polls"."updated_at" IS 'Poll update timestamp'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "polls"."updated_at" IS 'Poll update timestamp'`);
        await queryRunner.query(`ALTER TABLE "polls" DROP COLUMN "updated_at"`);
    }

}
