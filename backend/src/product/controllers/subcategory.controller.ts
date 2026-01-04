import {
  Body,
  Controller,
  Delete,
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
import User from 'src/db/entities/user/user.entity';
import { user } from 'src/common/decorator/user.decorator';
import CreateSubcategoryDTO from '../dto/create-subcategory.dto';
import SubcategoryService from '../services/subcategory.service';
import UpdateSubcategoryDTO from '../dto/update-subcategory.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('category')
export default class SubcategoryController {
  readonly logger = new Logger(SubcategoryController.name);
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post('create')
  async createSubcategory(
    @Body() createSubcategoryDTO: CreateSubcategoryDTO,
    @user() user: User,
  ) {
    return await this.subcategoryService.createSubcategory(
      user,
      createSubcategoryDTO,
    );
  }

  @Put('update')
  async updateCategory(
    @Body() updateSubcategoryDTO: UpdateSubcategoryDTO,
    @user() user: User,
  ) {
    return await this.subcategoryService.updateSubcategory(
      user,
      updateSubcategoryDTO,
    );
  }

  @Delete('delete/:id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.subcategoryService.deleteSubcategory(user, id);
  }
}
