import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import CookRecipRepository from './cook-recipe.repository';
import HouseService from 'src/house/house.service';
import User from 'src/database/entities/user/user.entity';
import CreateCookRecipeDTO from './dto/create-cook-recipe.dto';
import { plainToInstance } from 'class-transformer';
import CookRecipe from 'src/database/entities/cook-recipe/cook-recipe.entity';
import UpdateCookRecipeDTO from './dto/update-cook-recipe.dto';
import ProductRepository from 'src/product/repositories/product.repository';
import CreateCookRecipeProductDTO from './dto/create-cook-recipe-product.dto';
import UpdateCookRecipeProductDTO from './dto/update-cook-recipe-product.dto';
import CookRecipeProduct from 'src/database/entities/cook-recipe/cook-recipe-product.entity';
import CookRecipeOutputDTO from './dto-output/cook-recipe.dto';
import CookRecipeProductOutputDTO from './dto-output/cook-recipe-product.dto';

@Injectable()
export default class CookRecipeService {
  readonly logger = new Logger(CookRecipeService.name);
  constructor(
    private readonly cookRecipeRepository: CookRecipRepository,
    private readonly productRepository: ProductRepository,
    private readonly houseService: HouseService,
  ) {}

  async listCookRecipesJoinByHouseId(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);

    const listCookRecipes =
      await this.cookRecipeRepository.listCookRecipesJoinProductByHouseId(
        houseId,
      );

    return plainToInstance(CookRecipeOutputDTO, listCookRecipes);
  }

  async createCookRecipe(user: User, createCookRecipeDTO: CreateCookRecipeDTO) {
    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      createCookRecipeDTO.houseId,
    );

    const cookRecipeCreated = await this.cookRecipeRepository.createCookRecipe(
      plainToInstance(CookRecipe, createCookRecipeDTO),
    );

    return plainToInstance(CookRecipeOutputDTO, cookRecipeCreated);
  }

  async updateCookRecipe(user: User, updateCookRecipeDTO: UpdateCookRecipeDTO) {
    const cookRecipeFound = await this.cookRecipeRepository.getCookRecipe(
      updateCookRecipeDTO.id,
    );

    if (!cookRecipeFound)
      throw new BadRequestException('This cookRecipe doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      cookRecipeFound.houseId,
    );

    const updatedCookRecipe = this.cookRecipeRepository.updateCookRecipe(
      plainToInstance(CookRecipe, updateCookRecipeDTO),
    );

    return plainToInstance(CookRecipeOutputDTO, updatedCookRecipe);
  }

  async deleteCookRecipe(user: User, id: number) {
    const cookRecipeFound = await this.cookRecipeRepository.getCookRecipe(id);

    if (!cookRecipeFound)
      throw new BadRequestException('This cookRecipe doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      cookRecipeFound.houseId,
    );

    return this.cookRecipeRepository.deleteCookRecipe(id);
  }

  //Cook Recipe Product RELATION
  async createCookRecipeProduct(
    user: User,
    createCookRecipeProductDTO: CreateCookRecipeProductDTO,
  ) {
    const houseId = await this.getHouseIdFromProductCookRecipe(
      createCookRecipeProductDTO.productId,
      createCookRecipeProductDTO.cookRecipeId,
    );

    await this.houseService.checkIfUserisOnHouseAndUser(user, houseId);

    const createdCookRecipeProduct =
      await this.cookRecipeRepository.createCookRecipeProduct(
        plainToInstance(CookRecipeProduct, createCookRecipeProductDTO),
      );

    return plainToInstance(
      CookRecipeProductOutputDTO,
      createdCookRecipeProduct,
    );
  }

  async updateCookRecipeProduct(
    user: User,
    updateCookRecipeProductDTO: UpdateCookRecipeProductDTO,
  ) {
    const cookRecipeProductFound =
      await this.cookRecipeRepository.getCookRecipeProduct(
        updateCookRecipeProductDTO.cookRecipeId,
        updateCookRecipeProductDTO.productId,
      );

    if (!cookRecipeProductFound)
      throw new BadRequestException('Cook Recipe Product Relation not Found');

    const houseId = await this.getHouseIdFromProductCookRecipe(
      cookRecipeProductFound.productId,
      cookRecipeProductFound.cookRecipeId,
    );

    await this.houseService.checkIfUserisOnHouseAndUser(user, houseId);

    cookRecipeProductFound.quantity = updateCookRecipeProductDTO.quantity;
    const cookRecipeUpdated =
      await this.cookRecipeRepository.updateCookRecipeProduct(
        plainToInstance(CookRecipeProduct, cookRecipeProductFound),
      );

    return plainToInstance(CookRecipeProductOutputDTO, cookRecipeUpdated);
  }
  async deleteCookRecipeProduct(
    user: User,
    cookRecipeId: number,
    productId: number,
  ) {
    const cookRecipeProductFound =
      await this.cookRecipeRepository.getCookRecipeProduct(
        cookRecipeId,
        productId,
      );

    if (!cookRecipeProductFound)
      throw new BadRequestException('Cook Recipe Product Relation not Found');

    const houseId = await this.getHouseIdFromProductCookRecipe(
      cookRecipeProductFound.productId,
      cookRecipeProductFound.cookRecipeId,
    );

    await this.houseService.checkIfUserisOnHouseAndUser(user, houseId);

    return await this.cookRecipeRepository.deleteCookRecipeProduct(
      cookRecipeId,
      productId,
    );
  }

  async getHouseIdFromProductCookRecipe(
    productId: number,
    cookRecipeId: number,
  ): Promise<number> {
    const productFound = await this.productRepository.getProduct(productId);

    if (!productFound) throw new BadRequestException('Product doesnt Exist');

    const cookRecipeFound =
      await this.cookRecipeRepository.getCookRecipe(cookRecipeId);

    if (!cookRecipeFound)
      throw new BadRequestException('CookRecipe doesnt Exist');

    if (cookRecipeFound.houseId != productFound.houseId)
      throw new BadRequestException(
        'Houses dont match on Product and CookRecipe',
      );

    return cookRecipeFound.houseId;
  }
  //Make CookRecipe And go Down Ingredient Products
  async makeCookRecipe(user: User, id: number) {
    const foundCookRecipe =
      await this.cookRecipeRepository.getCookRecipeJoinProduct(id);

    if (!foundCookRecipe)
      throw new BadRequestException('Cook Recipe Doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      foundCookRecipe.houseId,
    );

    for (const cookRecipeProduct of foundCookRecipe.cookRecipeProducts) {
      let quantityToDelete = cookRecipeProduct.quantity;

      for (const productBatch of cookRecipeProduct.product.productBatches) {
        productBatch.quantity = productBatch.quantity - quantityToDelete;
        quantityToDelete = 0;
        if (productBatch.quantity < 0) {
          quantityToDelete += -1 * productBatch.quantity;
          productBatch.quantity = 0;
        } else break;
      }
    }

    const updatedCookRecipe =
      await this.cookRecipeRepository.updateCookRecipe(foundCookRecipe);

    return plainToInstance(CookRecipeOutputDTO, updatedCookRecipe);
  }
}
