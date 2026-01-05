import { Module } from '@nestjs/common';
import AuthModule from 'src/auth/auth.module';
import HouseModule from 'src/house/house.module';
import ProductModule from 'src/product/product.module';
import CookRecipeController from './cook-recipe.controller';
import CookRecipeService from './cook-recipe.service';
import CookRecipRepository from './cook-recipe.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, HouseModule, ProductModule, JwtModule],
  controllers: [CookRecipeController],
  providers: [CookRecipeService, CookRecipRepository],
  exports: [],
})
export default class CookRecipeModule {}
