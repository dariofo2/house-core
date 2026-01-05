import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RoleName } from 'src/common/enum/role.enum';
import HouseService from './house.service';
import User from 'src/database/entities/user/user.entity';
import { user } from 'src/common/decorator/user.decorator';
import AuthGuard from 'src/auth/guards/auth.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import CreateHouseDTO from './dto/create-house.dto';
import UpdateHouseDTO from './dto/update-house.dto';
import AddUserHouseDTO from './dto/add-user-house.dto';
import UpdateUserHouseDTO from './dto/update-user-house.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import HouseOutputDTO from './dto-output/house-output.dto';
import UserHouseOutputDTO from './dto-output/user-house-output.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('house')
export default class HouseController {
  logger = new Logger(HouseController.name);
  constructor(private readonly houseService: HouseService) {}

  @Get('get/:id')
  @ApiOperation({ summary: 'Get a House', description: '' })
  @ApiResponse({ status: 200, type: HouseOutputDTO })
  @ApiParam({ name: 'id', example: 1 })
  async getHouse(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return await this.houseService.getHouse(user, id);
  }

  @Get('list')
  @ApiOperation({ summary: 'List Houses', description: '' })
  @ApiResponse({ status: 200, type: [HouseOutputDTO] })
  async listHouses(@user() user: User) {
    return await this.houseService.listHouses(user);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(RoleGuard)
  @Get('listAll')
  @ApiOperation({
    summary: 'List ALL Houses (ONLY ADMIN USER)',
    description: '',
  })
  @ApiResponse({ status: 200, type: [HouseOutputDTO] })
  async listAllHouses() {
    return await this.houseService.listAllHouses();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a House', description: '' })
  @ApiResponse({ status: 200, type: HouseOutputDTO })
  async createHouse(
    @Body() createHouseDTO: CreateHouseDTO,
    @user() user: User,
  ) {
    return await this.houseService.createHouse(user, createHouseDTO);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update a House', description: '' })
  @ApiResponse({ status: 200, type: HouseOutputDTO })
  async updateHouse(
    @Body() updateHouseDTO: UpdateHouseDTO,
    @user() user: User,
  ) {
    return await this.houseService.updateHouse(user, updateHouseDTO);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a House', description: '' })
  @ApiResponse({ status: 200, type: String })
  @ApiParam({ name: 'id', example: 1 })
  async deleteHouse(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return await this.houseService.deleteHouse(user, id);
  }

  //USER HOUSE RELATION
  @Get('listUsersHouse/:houseId')
  @ApiOperation({ summary: 'Get a House', description: '' })
  @ApiResponse({ status: 200, type: UserHouseOutputDTO })
  async getUsersHouse(
    @Param('houseId', ParseIntPipe) houseId: number,
    @user() user: User,
  ) {
    return await this.houseService.listUsersHouse(user, houseId);
  }

  @Post('addUserHouse')
  @ApiOperation({ summary: 'Add User To House', description: '' })
  @ApiResponse({ status: 200, type: UserHouseOutputDTO })
  async addUserHouse(
    @Body() addUserHouseDTO: AddUserHouseDTO,
    @user() user: User,
  ) {
    return await this.houseService.addUserToHouse(user, addUserHouseDTO);
  }

  @Delete('deleteUserHouse/:userId/:houseId')
  @ApiOperation({ summary: 'Delete a user from House', description: '' })
  @ApiResponse({ status: 200, type: UserHouseOutputDTO })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiParam({ name: 'houseId', example: 1 })
  async deleteUserHouse(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('houseId') houseId: number,
    @user() user: User,
  ) {
    return await this.houseService.deleteUserFromHouse(user, userId, houseId);
  }

  @Put('updateUserHouse')
  @ApiOperation({ summary: 'Get a House', description: '' })
  @ApiResponse({ status: 200, type: UserHouseOutputDTO })
  async updateUserHouse(
    @Body() updateUserHouseDTO: UpdateUserHouseDTO,
    @user() user: User,
  ) {
    return await this.houseService.updateUserFromHouse(
      user,
      updateUserHouseDTO,
    );
  }
}
