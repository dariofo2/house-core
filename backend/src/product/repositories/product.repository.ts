import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import ProductBatch from 'src/db/entities/product/product-batch.entity';
import Product from 'src/db/entities/product/product.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class ProductRepository {
  readonly logger = new Logger(ProductRepository.name);
  constructor(private readonly datasource: DataSource) {}

  async getProduct(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const productFound = await queryRunner.manager.findOne(Product, {
        where: {
          id: Equal(id),
        },
      });

      return productFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listProductsByHouseId(houseId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const categoriesFound = await queryRunner.manager.find(Product, {
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

  async createProduct(product: Product) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCategory = await queryRunner.manager.save(Product, product);

      return createdCategory;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateProduct(product: Product) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdCategory = await queryRunner.manager.save(Product, product);

      return createdCategory;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProduct(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const deletedCategory = await queryRunner.manager.delete(Product, {
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

  // BATCH PRODUCT
  async getProductBatch(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const productBatchFound = await queryRunner.manager.findOne(
        ProductBatch,
        {
          where: {
            id: Equal(id),
          },
        },
      );

      return productBatchFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
  async getProductBatches(productId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const productBatchFound = await queryRunner.manager.find(ProductBatch, {
        where: {
          productId: Equal(productId),
        },
      });

      return productBatchFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
  async createProductBatch(productBatch: ProductBatch) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const productBatchFound = await queryRunner.manager.save(
        ProductBatch,
        productBatch,
      );

      return productBatchFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateProductBatch(productBatch: ProductBatch) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const productBatchFound = await queryRunner.manager.save(
        ProductBatch,
        productBatch,
      );

      return productBatchFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProductBatch(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const productBatchFound = await queryRunner.manager.delete(ProductBatch, {
        id: Equal(id),
      });

      return productBatchFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
