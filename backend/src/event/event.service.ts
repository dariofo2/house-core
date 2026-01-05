import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import User from 'src/database/entities/user/user.entity';
import EventRepository from './event.repository';
import CreateEventDTO from './dto/create-event.dto';
import UpdateEventDTO from './dto/update-event.dto';
import HouseService from 'src/house/house.service';
import { plainToInstance } from 'class-transformer';
import Event from 'src/database/entities/event/event.entity';
import EventOutputDTO from './dto-output/event-output.dto';

@Injectable()
export default class EventService {
  readonly logger = new Logger(EventService.name);
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly houseService: HouseService,
  ) {}
  async listEventsByHouse(user: User, houseId: number) {
    await this.houseService.checkIfUserisOnHouse(user, houseId);

    const eventsFound = await this.eventRepository.listEventsByHouseId(houseId);

    return plainToInstance(EventOutputDTO, eventsFound);
  }

  async createEvent(user: User, createEventDTO: CreateEventDTO) {
    await this.houseService.checkIfUserisOnHouseAndUser(
      user,
      createEventDTO.houseId,
    );

    const createdEvent = await this.eventRepository.createEvent(
      plainToInstance(Event, createEventDTO),
    );

    return plainToInstance(EventOutputDTO, createdEvent);
  }

  async updateEvent(user: User, updateEventDTO: UpdateEventDTO) {
    const eventFound = await this.eventRepository.getEvent(updateEventDTO.id);

    if (!eventFound) throw new BadRequestException('Event does not Exist');

    await this.houseService.checkIfUserisOnHouseAndAdmin(
      user,
      eventFound.houseId,
    );

    const eventUpdated = await this.eventRepository.updateEvent(
      plainToInstance(Event, updateEventDTO),
    );

    return plainToInstance(EventOutputDTO, eventUpdated);
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

    const updatedEvent = await this.eventRepository.updateEvent(eventFound);

    return plainToInstance(EventOutputDTO, updatedEvent);
  }
}
