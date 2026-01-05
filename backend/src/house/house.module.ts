import { Module } from '@nestjs/common';
import HouseController from './house.controller';
import HouseService from './house.service';
import HouseRepository from './house.repository';
import UserModule from 'src/user/user.module';
import AuthModule from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, AuthModule, JwtModule],
  controllers: [HouseController],
  providers: [HouseService, HouseRepository],
  exports: [HouseService, HouseRepository],
})
export default class HouseModule {}
