import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user/user.entity';
import UserRole from './entities/user/user-role.entity';
import Role from './entities/user/role.entity';
import House from './entities/house/house.entity';
import UserHouse from './entities/house/user-house.entity';
import Event from './entities/event/event.entity';
import CookRecipe from './entities/cook-recipe/cook-recipe.entity';
import CookRecipeProduct from './entities/cook-recipe/cook-recipe-product.entity';
import Product from './entities/product/product.entity';
import Category from './entities/product/category.entity';
import Subcategory from './entities/product/subcategory.entity';
import ProductBatch from './entities/product/product-batch.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: `${process.env.DB_HOST}`,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([
      /* User + Role */
      User,
      UserRole,
      Role,
      /* House */
      House,
      UserHouse,
      /* Event */
      Event,
      /* Cook Recipe */
      CookRecipe,
      CookRecipeProduct,
      /* Product */
      Product,
      Category,
      Subcategory,
      ProductBatch,
    ]),
  ],
  exports: [TypeOrmModule],
})
export default class DBModule {}
