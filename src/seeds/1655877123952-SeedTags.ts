import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTags1655877123952 implements MigrationInterface {
  name = 'SeedTags1655877123952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );
  }

  public async down(): Promise<void> {}
}
