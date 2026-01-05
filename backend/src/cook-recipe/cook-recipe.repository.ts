import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import CookRecipeProduct from 'src/database/entities/cook-recipe/cook-recipe-product.entity';
import CookRecipe from 'src/database/entities/cook-recipe/cook-recipe.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class CookRecipRepository {
  readonly logger = new Logger(CookRecipRepository.name);
  constructor(private readonly datasource: DataSource) {}

  async getCookRecipe(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const cookRecipeFound = await queryRunner.manager.findOne(CookRecipe, {
        where: {
          id: Equal(id),
        },
      });

      return cookRecipeFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listCookRecipesJoinProductByHouseId(houseId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const cookRecipeFound = await queryRunner.manager.find(CookRecipe, {
        where: {
          houseId: Equal(houseId),
        },
        relations: {
          cookRecipeProducts: {
            product: {
              productBatches: true,
            },
          },
        },
      });

      return cookRecipeFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getCookRecipeJoinProduct(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const cookRecipeFound = await queryRunner.manager.findOne(CookRecipe, {
        where: {
          id: Equal(id),
        },
        relations: {
          cookRecipeProducts: {
            product: {
              productBatches: true,
            },
          },
        },
      });

      return cookRecipeFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createCookRecipe(cookRecipe: CookRecipe) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCookRecipe = await queryRunner.manager.save(
        CookRecipe,
        cookRecipe,
      );

      return createdCookRecipe;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateCookRecipe(cookRecipe: CookRecipe) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCookRecipe = await queryRunner.manager.save(
        CookRecipe,
        cookRecipe,
      );

      return createdCookRecipe;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
  async deleteCookRecipe(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const deletedCookRecipe = await queryRunner.manager.delete(CookRecipe, {
        id: id,
      });

      return deletedCookRecipe;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  //COOKRECIPE PRODUCT RELATION
  async getCookRecipeProduct(cookRecipeId: number, productId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const foundCookRecipeProduct = await queryRunner.manager.findOne(
        CookRecipeProduct,
        {
          where: {
            cookRecipeId: Equal(cookRecipeId),
            productId: Equal(productId),
          },
        },
      );

      return foundCookRecipeProduct;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createCookRecipeProduct(cookRecipeProduct: CookRecipeProduct) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCookRecipe = await queryRunner.manager.save(
        CookRecipeProduct,
        cookRecipeProduct,
      );

      return createdCookRecipe;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateCookRecipeProduct(cookRecipeProduct: CookRecipeProduct) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCookRecipe = await queryRunner.manager.save(
        CookRecipeProduct,
        cookRecipeProduct,
      );

      return createdCookRecipe;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCookRecipeProduct(cookRecipeId: number, productId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const deleteCookRecipe = await queryRunner.manager.delete(
        CookRecipeProduct,
        { cookRecipeId: Equal(cookRecipeId), productId: Equal(productId) },
      );

      return deleteCookRecipe;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
