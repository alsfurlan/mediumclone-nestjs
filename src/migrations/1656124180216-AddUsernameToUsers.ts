import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameToUsers1656124180216 implements MigrationInterface {
  name = 'AddUsernameToUsers1656124180216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}
