import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import AuthGuard from 'src/auth/guards/auth.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RoleName } from 'src/common/enum/role.enum';
import CreateCategoryDTO from '../dto/create-category.dto';
import User from 'src/database/entities/user/user.entity';
import CategoryService from '../services/category.service';
import { user } from 'src/common/decorator/user.decorator';
import UpdateCategoryDTO from '../dto/update-category.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('category')
export default class CategoryController {
  readonly logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Get('getByHouseJoinProduct/:houseId')
  async getCategoryJoinProduct(
    @Param('houseId', ParseIntPipe) houseId: number,
    @user() user: User,
  ) {
    return await this.categoryService.getCategoriesFromHouseJoin(user, houseId);
  }

  @Post('create')
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
    @user() user: User,
  ) {
    return await this.categoryService.createCategory(user, createCategoryDTO);
  }

  @Put('update')
  async updateCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @user() user: User,
  ) {
    return await this.categoryService.updateCategory(user, updateCategoryDTO);
  }

  @Delete('delete/:id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.categoryService.deleteCategory(user, id);
  }
}
