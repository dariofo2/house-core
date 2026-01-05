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
import User from 'src/database/entities/user/user.entity';
import { user } from 'src/common/decorator/user.decorator';
import ProductService from '../services/product.service';
import CreateProductDTO from '../dto/create-product.dto';
import UpdateProductDTO from '../dto/update-product.dto';
import CreateProductBatchDTO from '../dto/create-product-batch.dto';
import UpdateProductBatchDTO from '../dto/update-product-batch.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import ProductOutputDTO from '../dto-output/product-output.dto';
import ProductBatchOutputDTO from '../dto-output/product-batch-output.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('product')
export default class ProductController {
  readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create Product',
  })
  @ApiResponse({ type: ProductOutputDTO })
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @user() user: User,
  ) {
    return await this.productService.createProduct(user, createProductDTO);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Update Product',
  })
  @ApiResponse({ type: ProductOutputDTO })
  async updateProduct(
    @Body() updateProductDTO: UpdateProductDTO,
    @user() user: User,
  ) {
    return await this.productService.updateProduct(user, updateProductDTO);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete Product',
  })
  @ApiResponse({ type: ProductOutputDTO })
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.productService.deleteProduct(user, id);
  }

  @Post('createBatch')
  @ApiOperation({
    summary: 'Delete a Product Batch',
  })
  @ApiResponse({ type: ProductBatchOutputDTO })
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
  @ApiOperation({
    summary: 'Update Product Batch',
  })
  @ApiResponse({ type: ProductBatchOutputDTO })
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
  @ApiOperation({
    summary: 'Increment a Product Batch by Product Step',
  })
  @ApiResponse({ type: ProductBatchOutputDTO })
  async incrementProductBatch(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.productService.incrementProductBatch(user, id);
  }

  @Post('decrementBatch/:id')
  @ApiOperation({
    summary: 'Decrement a Product Batch by Product Step',
  })
  @ApiResponse({ type: ProductBatchOutputDTO })
  async decrementProductBatch(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ) {
    return await this.productService.decrementProductBatch(user, id);
  }
}
