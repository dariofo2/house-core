import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import DBModule from './db/db.module';
import UserModule from './user/user.module';
import AuthModule from './auth/auth.module';
import HouseModule from './house/house.module';
import ProductModule from './product/product.module';
import EventModule from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DBModule,
    UserModule,
    AuthModule,
    HouseModule,
    ProductModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
