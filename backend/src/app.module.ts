import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import DBModule from './database/db.module';
import UserModule from './user/user.module';
import AuthModule from './auth/auth.module';
import HouseModule from './house/house.module';
import ProductModule from './product/product.module';
import EventModule from './event/event.module';
import { JwtModule } from '@nestjs/jwt';
import CookRecipeModule from './cook-recipe/cook-recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DBModule,
    UserModule,
    AuthModule,
    JwtModule,
    HouseModule,
    ProductModule,
    EventModule,
    CookRecipeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
