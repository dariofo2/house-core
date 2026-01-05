import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import House from 'src/database/entities/house/house.entity';
import UserHouse from 'src/database/entities/house/user-house.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class HouseRepository {
  logger = new Logger(HouseRepository.name);
  constructor(private readonly dataSource: DataSource) {}

  async getHouse(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const houseFound = await queryRunner.manager.findOne(House, {
        where: {
          id: Equal(id),
        },
      });

      return houseFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getHouseByUserId(houseId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const houseFound = await queryRunner.manager.findOne(House, {
        where: {
          id: houseId,
          usersHouse: {
            userId: userId,
          },
        },
      });

      return houseFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listUserHouses(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const housesFound = await queryRunner.manager.find(House, {
        where: {
          usersHouse: {
            userId: Equal(userId),
          },
        },
      });

      return housesFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async listAllHouses() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const housesFound = await queryRunner.manager.find(House);

      return housesFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createHouse(house: House) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdHouse = await queryRunner.manager.save(House, house);

      return createdHouse;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateHouse(house: House) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdHouse = await queryRunner.manager.save(House, house);

      return createdHouse;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteHouse(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const deletedHouse = await queryRunner.manager.delete(House, {
        id: id,
      });

      return deletedHouse;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async addUserHouse(userHouse: UserHouse) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdUserHouse = await queryRunner.manager.save(
        UserHouse,
        userHouse,
      );

      return createdUserHouse;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUserHouse(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdUserHouse = await queryRunner.manager.delete(UserHouse, {
        id: id,
      });

      return createdUserHouse;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserHouse(userHouse: UserHouse) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const createdUserHouse = await queryRunner.manager.save(
        UserHouse,
        userHouse,
      );

      return createdUserHouse;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUsersHouseByHouseId(houseId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const usersFound = await queryRunner.manager.find(UserHouse, {
        where: {
          houseId: houseId,
        },
        relations: { role: true, user: true },
      });

      return usersFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUserHouse(houseId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const userHouseFound = await queryRunner.manager.findOne(UserHouse, {
        where: {
          userId: Equal(userId),
          houseId: Equal(houseId),
        },
        relations: {
          role: true,
        },
      });

      return userHouseFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
