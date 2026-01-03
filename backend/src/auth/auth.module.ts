import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import UserModule from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import RoleGuard from './guards/role.guard';
import AuthGuard from './guards/auth.guard';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RoleGuard],
  exports: [AuthGuard, RoleGuard],
})
export default class AuthModule {}
