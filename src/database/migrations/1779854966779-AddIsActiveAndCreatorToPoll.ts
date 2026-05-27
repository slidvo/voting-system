import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveAndCreatorToPoll1779854966779 implements MigrationInterface {
    name = 'AddIsActiveAndCreatorToPoll1779854966779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "polls" ADD "created_by" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "polls"."created_by" IS 'ID of the user who created the poll'`);
        await queryRunner.query(`ALTER TABLE "polls" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`COMMENT ON COLUMN "polls"."isActive" IS 'Indicates whether the poll is active and can receive votes'`);
        await queryRunner.query(`ALTER TABLE "polls" ADD "creatorId" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "polls"."creatorId" IS 'Unique identifier of the user'`);
        await queryRunner.query(`ALTER TABLE "polls" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "polls" ADD CONSTRAINT "FK_57e3240e3361bf5e1400ba0191d" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "polls" DROP CONSTRAINT "FK_57e3240e3361bf5e1400ba0191d"`);
        await queryRunner.query(`ALTER TABLE "polls" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "polls"."creatorId" IS 'Unique identifier of the user'`);
        await queryRunner.query(`ALTER TABLE "polls" DROP COLUMN "creatorId"`);
        await queryRunner.query(`COMMENT ON COLUMN "polls"."isActive" IS 'Indicates whether the poll is active and can receive votes'`);
        await queryRunner.query(`ALTER TABLE "polls" DROP COLUMN "isActive"`);
        await queryRunner.query(`COMMENT ON COLUMN "polls"."created_by" IS 'ID of the user who created the poll'`);
        await queryRunner.query(`ALTER TABLE "polls" DROP COLUMN "created_by"`);
    }

}
