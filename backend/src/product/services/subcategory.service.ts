import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import SubcategoryRepository from '../repositories/subcategory.repository';
import HouseService from 'src/house/house.service';
import User from 'src/db/entities/user/user.entity';
import CreateSubcategoryDTO from '../dto/create-subcategory.dto';
import UpdateSubcategoryDTO from '../dto/update-subcategory.dto';
import { plainToInstance } from 'class-transformer';
import Subcategory from 'src/db/entities/product/subcategory.entity';
import CategoryRepository from '../repositories/category.repository';

@Injectable()
export default class SubcategoryService {
  readonly logger = new Logger(SubcategoryService.name);
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly subcategoryRepository: SubcategoryRepository,
    private readonly houseService: HouseService,
  ) {}

  async createSubcategory(
    user: User,
    createSubcategoryDTO: CreateSubcategoryDTO,
  ) {
    const foundCategory = await this.categoryRepository.getCategory(
      createSubcategoryDTO.categoryId,
    );

    if (!foundCategory) throw new BadRequestException('Category Doesnt Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      foundCategory.houseId,
    );

    const createdSubcategory =
      await this.subcategoryRepository.createSubcategory(
        plainToInstance(Subcategory, createSubcategoryDTO),
      );

    return createdSubcategory;
  }

  async updateSubcategory(
    user: User,
    updateSubcategoryDTO: UpdateSubcategoryDTO,
  ) {
    const foundSubcategory = await this.subcategoryRepository.getSubcategory(
      updateSubcategoryDTO.id,
    );

    if (!foundSubcategory)
      throw new BadRequestException('Subcategory Doesnt exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      foundSubcategory.category.houseId,
    );

    return await this.subcategoryRepository.updateSubcategory(
      plainToInstance(Subcategory, updateSubcategoryDTO),
    );
  }

  async deleteSubcategory(user: User, SubcategoryId: number) {
    const foundSubcategory =
      await this.subcategoryRepository.getSubcategory(SubcategoryId);

    if (!foundSubcategory)
      throw new BadRequestException('Subcategory Doesnt exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      foundSubcategory.category.houseId,
    );

    await this.subcategoryRepository.deleteSubcategory(SubcategoryId);
  }

  async getSubcategoriesFromCategory(
    user: User,
    houseId: number,
    categoryId: number,
  ) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);
    return await this.subcategoryRepository.listSubcategoriesByCategoryId(
      categoryId,
    );
  }

  /*
  async getCategoriesFromHouseJoin(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);
    return await this.subcategoryRepository.listCategoriesByHouseIdJoin(
      houseId,
    );
  }
    */
}
