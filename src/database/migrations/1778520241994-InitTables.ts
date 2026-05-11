import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1778520241994 implements MigrationInterface {
    name = 'InitTables1778520241994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "polls" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_b9bbb8fc7b142553c518ddffbb6" PRIMARY KEY ("id")); COMMENT ON COLUMN "polls"."id" IS 'Poll ID'; COMMENT ON COLUMN "polls"."title" IS 'Poll title'; COMMENT ON COLUMN "polls"."description" IS 'Poll description'; COMMENT ON COLUMN "polls"."createdAt" IS 'Poll creation timestamp'`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "poll_id" integer NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id")); COMMENT ON COLUMN "questions"."id" IS 'Question ID'; COMMENT ON COLUMN "questions"."text" IS 'Text of the question'; COMMENT ON COLUMN "questions"."createdAt" IS 'Question creation timestamp'; COMMENT ON COLUMN "questions"."poll_id" IS 'Foreign key referencing the associated poll'`);
        await queryRunner.query(`CREATE TABLE "answers" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "option_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id")); COMMENT ON COLUMN "answers"."id" IS 'Answer ID'; COMMENT ON COLUMN "answers"."user_id" IS 'Foreign key referencing the user who submitted the answer'; COMMENT ON COLUMN "answers"."option_id" IS 'Foreign key referencing the selected option'; COMMENT ON COLUMN "answers"."created_at" IS 'Answer creation timestamp'`);
        await queryRunner.query(`CREATE TABLE "options" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "question_id" integer NOT NULL, CONSTRAINT "PK_d232045bdb5c14d932fba18d957" PRIMARY KEY ("id")); COMMENT ON COLUMN "options"."id" IS 'Option ID'; COMMENT ON COLUMN "options"."text" IS 'Text of the option'; COMMENT ON COLUMN "options"."created_at" IS 'Option creation timestamp'; COMMENT ON COLUMN "options"."question_id" IS 'Foreign key referencing the associated question'`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "permissions" "public"."users_permissions_enum" array NOT NULL DEFAULT '{create_poll,watch_poll}', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS 'Unique identifier of the user'; COMMENT ON COLUMN "users"."name" IS 'Full name of the user'; COMMENT ON COLUMN "users"."email" IS 'Unique email address used for authentication'; COMMENT ON COLUMN "users"."password" IS 'Hashed password of the user'; COMMENT ON COLUMN "users"."created_at" IS 'Timestamp when the user account was created'; COMMENT ON COLUMN "users"."permissions" IS 'List of permissions granted to the user'`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" SERIAL NOT NULL, "name" character varying(500) NOT NULL, "description" text NOT NULL, "filename" character varying NOT NULL, "views" integer NOT NULL, "isPublished" boolean NOT NULL, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_4d1a4db0bc11abc1a80a167935c" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_67e979b8942acc80137116b6f12" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_67e979b8942acc80137116b6f12"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_4d1a4db0bc11abc1a80a167935c"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "options"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "polls"`);
    }

}
