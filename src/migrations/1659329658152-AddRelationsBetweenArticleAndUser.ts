import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsBetweenArticleAndUser1659329658152
  implements MigrationInterface
{
  name = 'AddRelationsBetweenArticleAndUser1659329658152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" ADD "authorId" integer`);
    await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "articles"."updateAt" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "articles"."updateAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "authorId"`);
  }
}
