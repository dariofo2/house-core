import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import AuthModule from 'src/auth/auth.module';
import HouseModule from 'src/house/house.module';
import EventController from './event.controller';
import EventService from './event.service';
import EventRepository from './event.repository';

@Module({
  imports: [JwtModule, AuthModule, HouseModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [],
})
export default class EventModule {}
