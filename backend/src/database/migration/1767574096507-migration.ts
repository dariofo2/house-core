import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767574096507 implements MigrationInterface {
    name = 'Migration1767574096507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cook_recipe" DROP COLUMN "maxDays"`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" ADD "steps" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" ADD "photo" character varying`);
        await queryRunner.query(`ALTER TABLE "cook_recipe_product" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" DROP CONSTRAINT "FK_8e1f1bb0a0f40bab0351fc40db2"`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" ALTER COLUMN "houseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" ADD CONSTRAINT "FK_8e1f1bb0a0f40bab0351fc40db2" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cook_recipe" DROP CONSTRAINT "FK_8e1f1bb0a0f40bab0351fc40db2"`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" ALTER COLUMN "houseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" ADD CONSTRAINT "FK_8e1f1bb0a0f40bab0351fc40db2" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cook_recipe_product" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" DROP COLUMN "steps"`);
        await queryRunner.query(`ALTER TABLE "cook_recipe" ADD "maxDays" integer NOT NULL`);
    }

}
