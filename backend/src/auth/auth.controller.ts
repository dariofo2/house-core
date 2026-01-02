import { Controller, Post } from '@nestjs/common';

@Controller()
export default class AuthController {
  @Post()
  async login() {}

  @Post()
  async logout() {}
}
