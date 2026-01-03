import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1767468983307 implements MigrationInterface {
  name = 'Migration1767468983307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_house" ADD "roleId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_house" ADD CONSTRAINT "FK_9982452196928db5a5b6b9f1ab3" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_house" DROP CONSTRAINT "FK_9982452196928db5a5b6b9f1ab3"`,
    );
    await queryRunner.query(`ALTER TABLE "user_house" DROP COLUMN "roleId"`);
  }
}
