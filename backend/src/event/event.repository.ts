import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Event from 'src/database/entities/event/event.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class EventRepository {
  readonly logger = new Logger(EventRepository.name);
  constructor(private readonly datasource: DataSource) {}

  async getEvent(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const eventFound = await queryRunner.manager.findOne(Event, {
        where: {
          id: Equal(id),
        },
      });

      return eventFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listEventsByHouseId(houseId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const eventFound = await queryRunner.manager.find(Event, {
        where: {
          houseId: Equal(houseId),
        },
      });

      return eventFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createEvent(event: Event) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const eventFound = await queryRunner.manager.save(Event, event);

      return eventFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateEvent(event: Event) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const eventFound = await queryRunner.manager.save(Event, event);

      return eventFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteEvent(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const eventFound = await queryRunner.manager.delete(Event, {
        id: Equal(id),
      });

      return eventFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
