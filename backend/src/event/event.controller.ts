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
import User from 'src/db/entities/user/user.entity';
import EventService from './event.service';
import CreateEventDTO from './dto/create-event.dto';
import UpdateEventDTO from './dto/update-event.dto';

@Roles(RoleName.ADMIN, RoleName.USER)
@UseGuards(AuthGuard, RoleGuard)
@Controller('event')
export default class EventController {
  readonly logger = new Logger(EventController.name);
  constructor(private readonly eventService: EventService) {}

  @Get('getByHouse/:houseId')
  async getEventByHouseId(
    @Param('houseId', ParseIntPipe) houseId: number,
    @user() user: User,
  ) {
    return await this.eventService.listEventsByHouse(user, houseId);
  }

  @Post('create')
  async createEvent(
    @Body() createEventDTO: CreateEventDTO,
    @user() user: User,
  ) {
    return await this.eventService.createEvent(user, createEventDTO);
  }

  @Put('update')
  async updateEvent(
    @Body() updateEventDTO: UpdateEventDTO,
    @user() user: User,
  ) {
    return await this.eventService.updateEvent(user, updateEventDTO);
  }

  @Delete('delete/:id')
  async deleteEvent(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return await this.eventService.deleteEvent(user, id);
  }
}
