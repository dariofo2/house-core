import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import User from 'src/db/entities/user/user.entity';
import EventRepository from './event.repository';
import CreateEventDTO from './dto/create-event.dto';
import UpdateEventDTO from './dto/update-event.dto';
import HouseService from 'src/house/house.service';
import { plainToInstance } from 'class-transformer';
import Event from 'src/db/entities/event/event.entity';

@Injectable()
export default class EventService {
  readonly logger = new Logger(EventService.name);
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly houseService: HouseService,
  ) {}
  async listEventsByHouse(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);

    return await this.eventRepository.listEventsByHouseId(houseId);
  }

  async createEvent(user: User, createEventDTO: CreateEventDTO) {
    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      createEventDTO.houseId,
    );

    await this.eventRepository.createEvent(
      plainToInstance(Event, createEventDTO),
    );
  }

  async updateEvent(user: User, updateEventDTO: UpdateEventDTO) {
    const eventFound = await this.eventRepository.getEvent(updateEventDTO.id);

    if (!eventFound) throw new BadRequestException('Event does not Exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      eventFound.houseId,
    );

    await this.eventRepository.updateEvent(
      plainToInstance(Event, updateEventDTO),
    );
  }

  async deleteEvent(user: User, id: number) {
    const eventFound = await this.eventRepository.getEvent(id);

    if (!eventFound) throw new BadRequestException('Event does not Exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      eventFound.houseId,
    );

    return await this.eventRepository.deleteEvent(id);
  }

  async resetTimeEvent(user: User, id: number) {
    const eventFound = await this.eventRepository.getEvent(id);

    if (!eventFound) throw new BadRequestException('Event does not Exist');

    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      eventFound.houseId,
    );

    eventFound.updatedAt = new Date();

    await this.eventRepository.updateEvent(eventFound);
  }
}
