import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedArticles1655877123954 implements MigrationInterface {
  name = 'SeedArticles1655877123954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First Article', 'First Article Description', 'First Article Body', 'coffee,dragons', 1), ('second-article', 'Second Article', 'Second Article Description', 'Second Article Body', 'coffee,dragons', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
