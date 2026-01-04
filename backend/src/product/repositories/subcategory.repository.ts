import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Subcategory from 'src/db/entities/product/subcategory.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class SubcategoryRepository {
  readonly logger = new Logger(SubcategoryRepository.name);
  constructor(private readonly datasource: DataSource) {}

  async getSubcategory(subCategoryId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const categoryFound = await queryRunner.manager.findOne(Subcategory, {
        where: {
          id: Equal(subCategoryId),
        },
        relations: { category: true },
      });

      return categoryFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listSubcategoriesByCategoryId(categoryId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const categoriesFound = await queryRunner.manager.find(Subcategory, {
        where: {
          categoryId: Equal(categoryId),
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

  async createSubcategory(subcategory: Subcategory) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCategory = await queryRunner.manager.save(
        Subcategory,
        subcategory,
      );

      return createdCategory;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateSubcategory(subcategory: Subcategory) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const updatedCategory = await queryRunner.manager.save(
        Subcategory,
        subcategory,
      );

      return updatedCategory;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSubcategory(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const deletedCategory = await queryRunner.manager.delete(Subcategory, {
        id: id,
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
