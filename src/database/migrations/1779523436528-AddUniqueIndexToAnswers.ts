import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIndexToAnswers1779523436528 implements MigrationInterface {
    name = 'AddUniqueIndexToAnswers1779523436528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "UQ_62c15cc9747fec940b216f66a8b" UNIQUE ("user_id", "option_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "UQ_62c15cc9747fec940b216f66a8b"`);
    }

}
