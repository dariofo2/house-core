import { Module } from '@nestjs/common';
import UserRepository from './user.repository';
import UserService from './user.service';
import UserController from './user.controller';
import DBModule from 'src/db/db.module';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export default class UserModule {}
