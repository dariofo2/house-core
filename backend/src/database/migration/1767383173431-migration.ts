import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1767383173431 implements MigrationInterface {
  name = 'Migration1767383173431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event" ("id" SERIAL NOT NULL, "houseId" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "maxDays" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_batch" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dfd61dce60415e9b7acd2321b3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cook_recipe" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "maxDays" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "houseId" integer, CONSTRAINT "PK_738a2ff6e7ad427ffca456012bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cook_recipe_product" ("id" SERIAL NOT NULL, "cookRecipeId" integer NOT NULL, "productId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40762538a4a7edfd606241c14a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "subcategoryId" integer NOT NULL, "houseId" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "unity" character varying, "step" integer NOT NULL DEFAULT '1', "photo" character varying, "minQuantity" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subcategory" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5ad0b82340b411f9463c8e9554d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "houseId" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "house" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c9220195fd0a289745855fe908" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_house" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "houseId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_377ac48e9144269163aaeeba389" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "roleId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_ad42f3d3bc8304bcddfc1650e39" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_batch" ADD CONSTRAINT "FK_78b174d14c3c15f1a076a1767e9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cook_recipe" ADD CONSTRAINT "FK_8e1f1bb0a0f40bab0351fc40db2" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cook_recipe_product" ADD CONSTRAINT "FK_94a8d2856bb145f9619178ada70" FOREIGN KEY ("cookRecipeId") REFERENCES "cook_recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cook_recipe_product" ADD CONSTRAINT "FK_536f4672651ed502db2a4aa6cc0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_a2f1b303a190cb90769082112ea" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_904b30d0611df66f73164e999db" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategory" ADD CONSTRAINT "FK_3fc84b9483bdd736f728dbf95b2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_687b90d4c31e130ce129cd56d2b" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_house" ADD CONSTRAINT "FK_782c389a1831c1ccf38e4453acb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_house" ADD CONSTRAINT "FK_db876abe7acfa9c963593a96d50" FOREIGN KEY ("houseId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_house" DROP CONSTRAINT "FK_db876abe7acfa9c963593a96d50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_house" DROP CONSTRAINT "FK_782c389a1831c1ccf38e4453acb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_687b90d4c31e130ce129cd56d2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategory" DROP CONSTRAINT "FK_3fc84b9483bdd736f728dbf95b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_904b30d0611df66f73164e999db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_a2f1b303a190cb90769082112ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cook_recipe_product" DROP CONSTRAINT "FK_536f4672651ed502db2a4aa6cc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cook_recipe_product" DROP CONSTRAINT "FK_94a8d2856bb145f9619178ada70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cook_recipe" DROP CONSTRAINT "FK_8e1f1bb0a0f40bab0351fc40db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_batch" DROP CONSTRAINT "FK_78b174d14c3c15f1a076a1767e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_ad42f3d3bc8304bcddfc1650e39"`,
    );
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_house"`);
    await queryRunner.query(`DROP TABLE "house"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "subcategory"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "cook_recipe_product"`);
    await queryRunner.query(`DROP TABLE "cook_recipe"`);
    await queryRunner.query(`DROP TABLE "product_batch"`);
    await queryRunner.query(`DROP TABLE "event"`);
  }
}
