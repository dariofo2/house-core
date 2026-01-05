import { forwardRef, Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import UserModule from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import RoleGuard from './guards/role.guard';
import AuthGuard from './guards/auth.guard';
import AuthApiGuard from './guards/auth-api.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        global: true,
        signOptions: { expiresIn: 5000000 },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RoleGuard, AuthApiGuard],
  exports: [AuthGuard, RoleGuard, AuthApiGuard, AuthService],
})
export default class AuthModule {}
