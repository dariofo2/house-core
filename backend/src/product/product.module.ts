import { Module } from '@nestjs/common';
import CategoryController from './controllers/category.controller';
import SubcategoryController from './controllers/subcategory.controller';
import ProductController from './controllers/product.controller';
import HouseModule from 'src/house/house.module';
import CategoryRepository from './repositories/category.repository';
import SubcategoryRepository from './repositories/subcategory.repository';
import ProductRepository from './repositories/product.repository';
import { JwtModule } from '@nestjs/jwt';
import AuthModule from 'src/auth/auth.module';
import CategoryService from './services/category.service';
import SubcategoryService from './services/subcategory.service';
import ProductService from './services/product.service';

@Module({
  imports: [HouseModule, JwtModule, AuthModule],
  controllers: [CategoryController, SubcategoryController, ProductController],
  providers: [
    CategoryService,
    SubcategoryService,
    ProductService,
    CategoryRepository,
    SubcategoryRepository,
    ProductRepository,
  ],
  exports: [],
})
export default class ProductModule {}
