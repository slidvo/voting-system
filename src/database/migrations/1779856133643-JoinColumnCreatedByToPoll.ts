import type { MigrationInterface, QueryRunner } from "typeorm";

export class JoinColumnCreatedByToPoll1779856133643 implements MigrationInterface {
    name = 'JoinColumnCreatedByToPoll1779856133643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "polls" DROP CONSTRAINT "FK_57e3240e3361bf5e1400ba0191d"`);
        await queryRunner.query(`ALTER TABLE "polls" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "polls" ADD CONSTRAINT "FK_78d25076a14dc1ffb56c5b9ec13" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "polls" DROP CONSTRAINT "FK_78d25076a14dc1ffb56c5b9ec13"`);
        await queryRunner.query(`ALTER TABLE "polls" ADD "creatorId" integer`);
        await queryRunner.query(`ALTER TABLE "polls" ADD CONSTRAINT "FK_57e3240e3361bf5e1400ba0191d" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
