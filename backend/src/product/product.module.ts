import { Module } from '@nestjs/common';
import CategoryController from './controllers/category.controller';
import SubcategoryController from './controllers/subcategory.controller';
import ProductController from './controllers/product.controller';
import HouseModule from 'src/house/house.module';
import CategoryRepository from './repositories/category.repository';
import SubcategoryRepository from './repositories/subcategory.repository';
import ProductRepository from './repositories/product.repository';

@Module({
  imports: [HouseModule],
  controllers: [CategoryController, SubcategoryController, ProductController],
  providers: [CategoryRepository, SubcategoryRepository, ProductRepository],
  exports: [],
})
export default class ProductModule {}
