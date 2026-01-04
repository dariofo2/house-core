import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Category from 'src/db/entities/product/category.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class CategoryRepository {
  readonly logger = new Logger(CategoryRepository.name);
  constructor(private readonly datasource: DataSource) {}

  async getCategory(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const categoryFound = await queryRunner.manager.findOne(Category, {
        where: {
          id: Equal(id),
        },
      });

      return categoryFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
  async getCategoryByHouseId(categoryId: number, houseId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const categoryFound = await queryRunner.manager.findOne(Category, {
        where: {
          houseId: Equal(houseId),
          id: Equal(categoryId),
        },
      });

      return categoryFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listCategoriesByHouseIdJoin(houseId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const categoriesFound = await queryRunner.manager.find(Category, {
        where: {
          houseId: Equal(houseId),
        },
        relations: {
          subcategories: {
            products: {
              productBatches: true,
            },
          },
        },
      });

      return categoriesFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listCategoriesByHouseId(houseId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const categoriesFound = await queryRunner.manager.find(Category, {
        where: {
          houseId: Equal(houseId),
        },
      });

      return categoriesFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createCategory(category: Category) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCategory = await queryRunner.manager.save(
        Category,
        category,
      );

      return createdCategory;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateCategory(category: Category) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const updatedCategory = await queryRunner.manager.save(
        Category,
        category,
      );

      return updatedCategory;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCategory(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const deletedCategory = await queryRunner.manager.delete(Category, {
        id: Equal(id),
      });

      return deletedCategory;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
