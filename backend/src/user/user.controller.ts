import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import UserService from './user.service';
import CreateUserDTO from './dto/create-user.dto';
import RoleGuard from 'src/auth/guards/role.guard';
import { RoleName } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import User from 'src/database/entities/user/user.entity';
import { user } from 'src/common/decorator/user.decorator';
import AuthGuard from 'src/auth/guards/auth.guard';
import UpdateUserDTO from './dto/update-user.dto';
import UpdateUserPasswordDTO from './dto/update-user-password.dto';
import { ApiParam } from '@nestjs/swagger';

@Roles(RoleName.ADMIN, RoleName.USER, RoleName.VISITOR)
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Get('get/:id')
  @ApiParam({ name: 'id', example: 1 })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUser(id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('list')
  async listUsers() {
    return await this.userService.listUsers();
  }

  @Post('create')
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    console.log('creating');
    return await this.userService.createUser(createUserDTO);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('createAdmin')
  async createUserAdmin(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.createUserAdmin(createUserDTO);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch('update')
  async updateUser(@Body() updateUserDTO: UpdateUserDTO, @user() user: User) {
    console.log(user);
    return await this.userService.updateUser(user, updateUserDTO);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch('updatePassword')
  async updatePassword(
    @Body() updateUserPasswordDTO: UpdateUserPasswordDTO,
    @user() user: User,
  ) {
    return await this.userService.updateUserPassword(
      user,
      updateUserPasswordDTO,
    );
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete('delete/:id')
  @ApiParam({ name: 'id', example: 2 })
  async deleteUser(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return await this.userService.deleteUser(user, id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('addUserRole/:userId/:roleName')
  @ApiParam({ name: 'userId', example: 1 })
  @ApiParam({ name: 'roleName', example: RoleName.ADMIN })
  async addUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleName', new ParseEnumPipe(RoleName)) roleName: RoleName,
  ) {
    await this.userService.addUserRole(userId, roleName);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('deleteUserRole/:userId/:roleName')
  @ApiParam({ name: 'userId', example: 1 })
  @ApiParam({ name: 'roleName', example: RoleName.ADMIN })
  async deleteUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleName', new ParseEnumPipe(RoleName)) roleName: RoleName,
  ) {
    await this.userService.deleteUserRole(userId, roleName);
  }
}
