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
import { user } from 'src/common/decorator/user.decorator';
import { RoleName } from 'src/common/enum/role.enum';
import User from 'src/database/entities/user/user.entity';
import CookRecipeService from './cook-recipe.service';
import CreateCookRecipeDTO from './dto/create-cook-recipe.dto';
import CreateCookRecipeProductDTO from './dto/create-cook-recipe-product.dto';
import UpdateCookRecipeProductDTO from './dto/update-cook-recipe-product.dto';
import UpdateCookRecipeDTO from './dto/update-cook-recipe.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import CookRecipeOutputDTO from './dto-output/cook-recipe.dto';
import CookRecipeProductOutputDTO from './dto-output/cook-recipe-product.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('cookRecipe')
export default class CookRecipeController {
  readonly logger = new Logger(CookRecipeController.name);
  constructor(private readonly cookRecipeService: CookRecipeService) {}

  @Get('listJoinByHouse/:houseId')
  @ApiOperation({ summary: 'List Join CookRecipes By House' })
  @ApiResponse({ status: 200, type: CookRecipeOutputDTO })
  async listJoinByHouse(
    @Param('houseId', ParseIntPipe) houseId: number,
    @user() user: User,
  ) {
    return await this.cookRecipeService.listCookRecipesJoinByHouseId(
      user,
      houseId,
    );
  }

  @Post('create')
  @ApiOperation({ summary: 'Create Cook Recipe' })
  @ApiResponse({ status: 200, type: CookRecipeOutputDTO })
  async createCookRecipe(
    @Body() createCookRecipeDTO: CreateCookRecipeDTO,
    @user() user: User,
  ) {
    return await this.cookRecipeService.createCookRecipe(
      user,
      createCookRecipeDTO,
    );
  }

  @Put('update')
  @ApiOperation({ summary: 'Update Cook Recipe' })
  @ApiResponse({ status: 200, type: CookRecipeOutputDTO })
  async updateCookRecipe(
    @Body() updateCookRecipeDTO: UpdateCookRecipeDTO,
    @user() user: User,
  ) {
    return await this.cookRecipeService.updateCookRecipe(
      user,
      updateCookRecipeDTO,
    );
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete Cook Recipe' })
  @ApiResponse({ status: 200, type: CookRecipeOutputDTO })
  async deleteCookRecipe(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.cookRecipeService.deleteCookRecipe(user, id);
  }

  // COOK RECIPE PRODUCT RELATION
  @Post('createCookRecipeProduct')
  @ApiOperation({ summary: 'Create Cook Recipe Product Relation' })
  @ApiResponse({ status: 200, type: CookRecipeProductOutputDTO })
  async createCookRecipeProduct(
    @Body() createCookRecipeProductDTO: CreateCookRecipeProductDTO,
    @user() user: User,
  ) {
    return await this.cookRecipeService.createCookRecipeProduct(
      user,
      createCookRecipeProductDTO,
    );
  }

  @Put('updateCookRecipeProduct')
  @ApiOperation({ summary: 'Update Cook Recipe Product Relation' })
  @ApiResponse({ status: 200, type: CookRecipeProductOutputDTO })
  async updateCookRecipeProduct(
    @Body() updateCookRecipeProductDTO: UpdateCookRecipeProductDTO,
    @user() user: User,
  ) {
    return await this.cookRecipeService.updateCookRecipeProduct(
      user,
      updateCookRecipeProductDTO,
    );
  }

  @Delete('deleteCookRecipeProduct/:cookRecipeId/:productId')
  @ApiOperation({ summary: 'Delete Cook Recipe Product Relation' })
  @ApiResponse({ status: 200, type: CookRecipeProductOutputDTO })
  async deleteCookRecipeProduct(
    @Param('cookRecipeId', ParseIntPipe) cookRecipeId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @user() user: User,
  ) {
    return await this.cookRecipeService.deleteCookRecipeProduct(
      user,
      cookRecipeId,
      productId,
    );
  }

  //Make Recipe Product and Delete Products
  @Post('makeCookRecipe/:id')
  @ApiOperation({ summary: 'Make a Recipe decreasing Product Batches' })
  @ApiResponse({ status: 200, type: CookRecipeOutputDTO })
  async makeCookRecipe(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.cookRecipeService.makeCookRecipe(user, id);
  }
}
