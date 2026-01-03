import { Body, Controller, Post, Res } from '@nestjs/common';
import LoginDTO from './dto/login.dto';
import AuthService from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const bearerJWT = await this.authService.login(loginDTO);
    response.cookie('jwtToken', bearerJWT, {
      httpOnly: true,
      secure: false,
      maxAge: 999999999,
    });

    return bearerJWT;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwtToken', {
      httpOnly: true,
      secure: false,
      maxAge: 999999999,
    });

    return 'Logout Succesfull';
  }
}
