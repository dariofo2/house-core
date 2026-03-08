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
import SubcategoryRepository from '../repositories/subcategory.repository';
import ProductOutputDTO from '../dto-output/product-output.dto';
import ProductBatchOutputDTO from '../dto-output/product-batch-output.dto';

@Injectable()
export default class ProductService {
  readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly houseService: HouseService,
    private readonly subcategoryRepository: SubcategoryRepository,
  ) {}

  async createProduct(user: User, createProductDTO: CreateProductDTO) {
    const subcategoryFound = await this.subcategoryRepository.getSubcategory(
      createProductDTO.subcategoryId,
    );

    if (
      !subcategoryFound ||
      subcategoryFound.category.houseId != createProductDTO.houseId
    )
      throw new BadRequestException(
        'The House Id of Category doesnt match with this house',
      );

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

    return plainToInstance(ProductOutputDTO, createdProduct);
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

    const updatedProduct = await this.productRepository.updateProduct(
      plainToInstance(Product, updateProductDTO),
    );

    return plainToInstance(ProductOutputDTO, updatedProduct);
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

    const createdProductBatch = await this.productRepository.createProductBatch(
      plainToInstance(ProductBatch, createProductBatchDTO),
    );

    return plainToInstance(ProductBatchOutputDTO, createdProductBatch);
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

    const updatedProductBatch = await this.productRepository.updateProductBatch(
      plainToInstance(ProductBatch, updateProductBatchDTO),
    );

    return plainToInstance(ProductBatchOutputDTO, updatedProductBatch);
  }

  async getProductBatches(user: User, productId: number) {
    const productFound = await this.productRepository.getProduct(productId);

    if (!productFound) throw new BadRequestException('Product doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      productFound.houseId,
    );

    const batches = await this.productRepository.getProductBatches(productId);

    return plainToInstance(ProductBatchOutputDTO, batches);
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

    const updatedProductBatch =
      await this.productRepository.updateProductBatch(foundProductBatch);

    return plainToInstance(ProductBatchOutputDTO, updatedProductBatch);
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

    const updatedProductBatch =
      await this.productRepository.updateProductBatch(foundProductBatch);

    return plainToInstance(ProductBatchOutputDTO, updatedProductBatch);
  }

  async confirmPurchase(user: User, productId: number, quantity: number) {
    const productFound = await this.productRepository.getProduct(productId);

    if (!productFound) throw new BadRequestException('Product doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      productFound.houseId,
    );

    const batches = await this.productRepository.getProductBatches(productId);

    if (batches.length === 0)
      throw new BadRequestException('No batches found for this product');

    const firstBatch = batches[0];
    firstBatch.quantity = (Number(firstBatch.quantity) || 0) + quantity;

    return await this.productRepository.updateProductBatch(firstBatch);
  }

  async listProductsToCarShop(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);

    const productsToBuy =
      await this.productRepository.listProductsWithLessQuantityThanMin(houseId);

    return productsToBuy;
  }
}
