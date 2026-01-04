import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import ProductRepository from '../repositories/product.repository';
import User from 'src/database/entities/user/user.entity';
import CreateProductDTO from '../dto/create-product.dto';
import HouseService from 'src/house/house.service';
import { plainToInstance } from 'class-transformer';
import Product from 'src/database/entities/product/product.entity';
import CreateProductBatchDTO from '../dto/create-product-batch.dto';
import UpdateProductBatchDTO from '../dto/update-product-batch.dto';
import ProductBatch from 'src/database/entities/product/product-batch.entity';
import UpdateProductDTO from '../dto/update-product.dto';

@Injectable()
export default class ProductService {
  readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly houseService: HouseService,
  ) {}

  async createProduct(user: User, createProductDTO: CreateProductDTO) {
    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      createProductDTO.houseId,
    );

    const createdProduct = await this.productRepository.createProduct(
      plainToInstance(Product, createProductDTO),
    );

    const newProductBatch = new ProductBatch();
    newProductBatch.productId = createdProduct.id;
    newProductBatch.quantity = 0;
    newProductBatch.expirationDate = null;

    await this.productRepository.createProductBatch(newProductBatch);

    return createdProduct;
  }

  async updateProduct(user: User, updateProductDTO: UpdateProductDTO) {
    const productFound = await this.productRepository.getProduct(
      updateProductDTO.id,
    );

    if (!productFound) throw new BadRequestException('Product doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      productFound.houseId,
    );

    return await this.productRepository.updateProduct(
      plainToInstance(Product, updateProductDTO),
    );
  }

  async deleteProduct(user: User, id: number) {
    const productFound = await this.productRepository.getProduct(id);

    if (!productFound) throw new BadRequestException('Product doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      productFound.houseId,
    );

    return await this.productRepository.deleteProduct(id);
  }
  //PRODUCT BATCH
  async createProductBatch(
    user: User,
    createProductBatchDTO: CreateProductBatchDTO,
  ) {
    const foundProductBatch = await this.productRepository.getProductBatch(
      createProductBatchDTO.productId,
    );

    if (!foundProductBatch)
      throw new BadRequestException('Product Batch doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      foundProductBatch.product.houseId,
    );

    return await this.productRepository.createProductBatch(
      plainToInstance(ProductBatch, createProductBatchDTO),
    );
  }

  async updateProductBatch(
    user: User,
    updateProductBatchDTO: UpdateProductBatchDTO,
  ) {
    const foundProductBatch = await this.productRepository.getProductBatch(
      updateProductBatchDTO.id,
    );

    if (!foundProductBatch)
      throw new BadRequestException('Product Batch doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      foundProductBatch.product.houseId,
    );

    return await this.productRepository.updateProductBatch(
      plainToInstance(ProductBatch, updateProductBatchDTO),
    );
  }

  async deleteProductBatch(user: User, id: number) {
    const foundProductBatch = await this.productRepository.getProductBatch(id);

    if (!foundProductBatch)
      throw new BadRequestException('Product Batch doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      foundProductBatch.product.houseId,
    );

    return await this.productRepository.deleteProductBatch(id);
  }

  async incrementProductBatch(user: User, id: number) {
    const foundProductBatch = await this.productRepository.getProductBatch(id);

    if (!foundProductBatch)
      throw new BadRequestException('Product Batch doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      foundProductBatch.product.houseId,
    );

    foundProductBatch.quantity =
      foundProductBatch.quantity + foundProductBatch.product.step;

    return await this.productRepository.updateProductBatch(foundProductBatch);
  }

  async decrementProductBatch(user: User, id: number) {
    const foundProductBatch = await this.productRepository.getProductBatch(id);

    if (!foundProductBatch)
      throw new BadRequestException('Product Batch doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      foundProductBatch.product.houseId,
    );

    foundProductBatch.quantity =
      foundProductBatch.quantity - foundProductBatch.product.step;

    if (foundProductBatch.quantity < 0) foundProductBatch.quantity = 0;

    return await this.productRepository.updateProductBatch(foundProductBatch);
  }
}
