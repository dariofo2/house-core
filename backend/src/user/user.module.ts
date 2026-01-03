import { forwardRef, Module } from '@nestjs/common';
import UserRepository from './user.repository';
import UserService from './user.service';
import UserController from './user.controller';
import DBModule from 'src/db/db.module';
import AuthModule from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => AuthModule), JwtModule, DBModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export default class UserModule {}
