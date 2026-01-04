import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1767471742202 implements MigrationInterface {
  name = 'Migration1767471742202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_house" DROP CONSTRAINT "FK_db876abe7acfa9c963593a96d50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_house" ADD CONSTRAINT "FK_db876abe7acfa9c963593a96d50" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_house" DROP CONSTRAINT "FK_db876abe7acfa9c963593a96d50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_house" ADD CONSTRAINT "FK_db876abe7acfa9c963593a96d50" FOREIGN KEY ("houseId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
