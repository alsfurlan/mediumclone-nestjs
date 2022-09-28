import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1655877123953 implements MigrationInterface {
  name = 'SeedUsers1655877123953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // password is 123
      `INSERT INTO users (username, email, password) VALUES ('foo','foo@gmail.com','$2b$10$LNsPDd3KzaqkApMxOPFyYOXx0QQ74DkeIBSqnMLyzXVXIL3U6d35O')`,
    );
  }

  public async down(): Promise<void> {}
}
