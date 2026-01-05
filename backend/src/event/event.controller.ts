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
import AuthGuard from 'src/auth/guards/auth.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { user } from 'src/common/decorator/user.decorator';
import { RoleName } from 'src/common/enum/role.enum';
import User from 'src/database/entities/user/user.entity';
import EventService from './event.service';
import CreateEventDTO from './dto/create-event.dto';
import UpdateEventDTO from './dto/update-event.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import EventOutputDTO from './dto-output/event-output.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('event')
export default class EventController {
  readonly logger = new Logger(EventController.name);
  constructor(private readonly eventService: EventService) {}

  @Get('getByHouse/:houseId')
  @ApiOperation({ summary: 'Get Events by House' })
  @ApiResponse({ status: 200, type: [EventOutputDTO] })
  async getEventByHouseId(
    @Param('houseId', ParseIntPipe) houseId: number,
    @user() user: User,
  ) {
    return await this.eventService.listEventsByHouse(user, houseId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create Event in House' })
  @ApiResponse({ status: 200, type: EventOutputDTO })
  async createEvent(
    @Body() createEventDTO: CreateEventDTO,
    @user() user: User,
  ) {
    return await this.eventService.createEvent(user, createEventDTO);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update Event in House' })
  @ApiResponse({ status: 200, type: EventOutputDTO })
  async updateEvent(
    @Body() updateEventDTO: UpdateEventDTO,
    @user() user: User,
  ) {
    return await this.eventService.updateEvent(user, updateEventDTO);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete Event in House' })
  @ApiResponse({ status: 200, type: EventOutputDTO })
  async deleteEvent(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return await this.eventService.deleteEvent(user, id);
  }

  @Post('reset/:id')
  @ApiOperation({ summary: 'Reset Timer Event in House' })
  @ApiResponse({ status: 200, type: EventOutputDTO })
  async resetEvent(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return await this.eventService.resetTimeEvent(user, id);
  }
}
