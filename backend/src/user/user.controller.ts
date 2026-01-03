import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
} from '@nestjs/common';
import UserService from './user.service';
import CreateUserDTO from './dto/create-user.dto';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('get')
  async getUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUser(userId);
  }

  @Get('list')
  async listUsers() {
    return await this.userService.listUsers();
  }

  @Put('create')
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.createUser(createUserDTO);
  }

  @Patch('update')
  async updateUser() {
    return await this.userService.updateUser();
  }

  @Delete('delete')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.deleteUser(userId);
  }
}
