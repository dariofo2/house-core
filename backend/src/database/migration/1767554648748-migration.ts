import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1767554648748 implements MigrationInterface {
  name = 'Migration1767554648748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_batch" ALTER COLUMN "expirationDate" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_batch" ALTER COLUMN "expirationDate" SET NOT NULL`,
    );
  }
}
