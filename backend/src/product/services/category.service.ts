import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import CategoryRepository from '../repositories/category.repository';
import HouseService from 'src/house/house.service';
import User from 'src/db/entities/user/user.entity';
import CreateCategoryDTO from '../dto/create-category.dto';
import UpdateCategoryDTO from '../dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
import Category from 'src/db/entities/product/category.entity';

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

    return createdCategory;
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

    return await this.categoryRepository.updateCategory(
      plainToInstance(Category, updateCategoryDTO),
    );
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
    return await this.categoryRepository.listCategoriesByHouseId(houseId);
  }

  async getCategoriesFromHouseJoin(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);
    return await this.categoryRepository.listCategoriesByHouseIdJoin(houseId);
  }
}
