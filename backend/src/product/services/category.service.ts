import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import CategoryRepository from '../repositories/category.repository';
import HouseService from 'src/house/house.service';
import User from 'src/database/entities/user/user.entity';
import CreateCategoryDTO from '../dto/create-category.dto';
import UpdateCategoryDTO from '../dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
import Category from 'src/database/entities/product/category.entity';
import CategoryOutputDTO from '../dto-output/category-output.dto';

@Injectable()
export default class CategoryService {
  readonly logger = new Logger(CategoryService.name);
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly houseService: HouseService,
  ) {}

  async createCategory(user: User, createCategoryDTO: CreateCategoryDTO) {
    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      createCategoryDTO.houseId,
    );

    const createdCategory = await this.categoryRepository.createCategory(
      plainToInstance(Category, createCategoryDTO),
    );

    return plainToInstance(CategoryOutputDTO, createdCategory);
  }

  async updateCategory(user: User, updateCategoryDTO: UpdateCategoryDTO) {
    const foundCategory = await this.categoryRepository.getCategory(
      updateCategoryDTO.id,
    );

    if (!foundCategory) throw new BadRequestException('Category Doesnt exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      foundCategory.houseId,
    );

    const updatedCategory = await this.categoryRepository.updateCategory(
      plainToInstance(Category, updateCategoryDTO),
    );

    return plainToInstance(CategoryOutputDTO, updatedCategory);
  }

  async deleteCategory(user: User, categoryId: number) {
    const foundCategory = await this.categoryRepository.getCategory(categoryId);

    if (!foundCategory) throw new BadRequestException('Category Doesnt exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      foundCategory.houseId,
    );

    await this.categoryRepository.deleteCategory(categoryId);
  }

  async getCategoriesFromHouse(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);

    const listCategories =
      await this.categoryRepository.listCategoriesByHouseId(houseId);

    return plainToInstance(CategoryOutputDTO, listCategories);
  }

  async getCategoriesFromHouseJoin(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);
    const listCategoriesJoined =
      await this.categoryRepository.listCategoriesByHouseIdJoin(houseId);

    return plainToInstance(CategoryOutputDTO, listCategoriesJoined);
  }
}
