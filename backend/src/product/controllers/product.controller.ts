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
import ProductService from '../services/product.service';
import CreateProductDTO from '../dto/create-product.dto';
import UpdateProductDTO from '../dto/update-product.dto';
import CreateProductBatchDTO from '../dto/create-product-batch.dto';
import UpdateProductBatchDTO from '../dto/update-product-batch.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('category')
export default class ProductController {
  readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @user() user: User,
  ) {
    return await this.productService.createProduct(user, createProductDTO);
  }

  @Put('update')
  async updateProduct(
    @Body() updateProductDTO: UpdateProductDTO,
    @user() user: User,
  ) {
    return await this.productService.updateProduct(user, updateProductDTO);
  }

  @Delete('delete/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.productService.deleteProduct(user, id);
  }

  @Post('createBatch')
  async createProductBatch(
    @Body() createProductBatchDTO: CreateProductBatchDTO,
    @user() user: User,
  ) {
    return await this.productService.createProductBatch(
      user,
      createProductBatchDTO,
    );
  }

  @Put('updateBatch')
  async updateProductBatch(
    @Body() updateProductBatchDTO: UpdateProductBatchDTO,
    @user() user: User,
  ) {
    return await this.productService.updateProductBatch(
      user,
      updateProductBatchDTO,
    );
  }

  @Post('incrementBatch/:id')
  async incrementProductBatch(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.productService.incrementProductBatch(user, id);
  }

  @Post('decrementBatch/:id')
  async decrementProductBatch(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.productService.decrementProductBatch(user, id);
  }
}
