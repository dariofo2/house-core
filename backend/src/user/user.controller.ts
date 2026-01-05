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
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import UserOutputDTO from './dto-output/user-output.dto';
import RoleOutputDTO from './dto-output/role-output.dto';

@Roles(RoleName.ADMIN, RoleName.USER, RoleName.VISITOR)
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Get('get/:id')
  @ApiOperation({ summary: 'Get an User', description: 'Get an User' })
  @ApiResponse({ status: 200, type: UserOutputDTO })
  @ApiParam({ name: 'id', example: 1 })
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserOutputDTO> {
    return await this.userService.getUser(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get('getUserRoles/:id')
  @ApiOperation({
    summary: 'Get Roles of a User',
    description: 'Get Roles of a User',
  })
  @ApiResponse({ status: 200, type: [RoleOutputDTO] })
  @ApiParam({ name: 'id', example: 1 })
  async getUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @user() user: User,
  ): Promise<RoleOutputDTO[]> {
    return await this.userService.getUserRoles(user, id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('list')
  @ApiOperation({
    summary: 'Get List of Users (Only can be User as role.ADMIN)',
    description: 'Get List of Users',
  })
  @ApiResponse({ status: 200, type: [UserOutputDTO] })
  async listUsers(): Promise<UserOutputDTO[]> {
    return await this.userService.listUsers();
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create an User(Can be used Anonymous)',
    description: 'Create an User(Can be used Anonymous)',
  })
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserOutputDTO> {
    return await this.userService.createUser(createUserDTO);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('createAdmin')
  @ApiOperation({
    summary: 'Create user (Only as Admin)',
    description: 'Create user (Only as Admin)',
  })
  @ApiResponse({ status: 200, type: UserOutputDTO })
  async createUserAdmin(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.createUserAdmin(createUserDTO);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch('update')
  @ApiOperation({
    summary: 'Update an User)',
    description: 'Update itself, and Admin can update Everyone',
  })
  @ApiResponse({ status: 200, type: UserOutputDTO })
  async updateUser(@Body() updateUserDTO: UpdateUserDTO, @user() user: User) {
    console.log(user);
    return await this.userService.updateUser(user, updateUserDTO);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch('updatePassword')
  @ApiOperation({
    summary: 'Update Password of an User',
    description:
      'Update password of Itself or Admin can update Everyone without lastPassword Check',
  })
  @ApiResponse({ status: 200, type: UserOutputDTO })
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
  @ApiOperation({
    summary: 'Delete an User',
    description: 'Delete itself but Admin can delete Everyone',
  })
  @ApiResponse({ status: 200, type: UserOutputDTO })
  @ApiParam({ name: 'id', example: 2 })
  async deleteUser(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return await this.userService.deleteUser(user, id);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('addUserRole/:userId/:roleName')
  @ApiOperation({
    summary: 'Add a Role to an User(Only Admin)',
    description: 'Add a Role to an User (Only admin)',
  })
  @ApiResponse({ status: 200, type: RoleOutputDTO })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiParam({ name: 'roleName', example: RoleName.ADMIN })
  async addUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleName', new ParseEnumPipe(RoleName)) roleName: RoleName,
  ) {
    return await this.userService.addUserRole(userId, roleName);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('deleteUserRole/:userId/:roleName')
  @ApiOperation({
    summary: 'Delete a Role from User (Only as Admin)',
    description: 'Delete a role From User (Only as Admin)',
  })
  @ApiResponse({ status: 200, type: RoleOutputDTO })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiParam({ name: 'roleName', example: RoleName.ADMIN })
  async deleteUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleName', new ParseEnumPipe(RoleName)) roleName: RoleName,
  ) {
    return await this.userService.deleteUserRole(userId, roleName);
  }
}
