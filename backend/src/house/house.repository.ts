import { Injectable, Logger } from '@nestjs/common';
import House from 'src/db/entities/house/house.entity';
import UserHouse from 'src/db/entities/house/user-house.entity';
import User from 'src/db/entities/user/user.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class HouseRepository {
  logger = new Logger(HouseRepository.name);
  constructor(private readonly dataSource: DataSource) {}

  async getHouse(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const houseFound = await queryRunner.manager.findOne(House, {
      where: {
        id: Equal(id),
      },
    });

    return houseFound;
  }

  async getHouseByUserId(houseId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const houseFound = await queryRunner.manager.findOne(House, {
      where: {
        id: houseId,
        usersHouse: {
          userId: userId,
        },
      },
    });

    return houseFound;
  }

  async listUserHouses(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const housesFound = await queryRunner.manager.find(House, {
      where: {
        usersHouse: {
          userId: Equal(userId),
        },
      },
    });

    return housesFound;
  }

  async listAllHouses() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const housesFound = await queryRunner.manager.find(House);

    return housesFound;
  }

  async createHouse(house: House) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const createdHouse = await queryRunner.manager.save(House, house);

    return createdHouse;
  }

  async updateHouse(house: House) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const createdHouse = await queryRunner.manager.save(House, house);

    return createdHouse;
  }

  async deleteHouse(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const deletedHouse = await queryRunner.manager.delete(House, {
      id: id,
    });

    return deletedHouse;
  }

  async addUserHouse(userHouse: UserHouse) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const createdUserHouse = await queryRunner.manager.save(
      UserHouse,
      userHouse,
    );

    return createdUserHouse;
  }

  async deleteUserHouse(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const createdUserHouse = await queryRunner.manager.delete(UserHouse, {
      id: id,
    });

    return createdUserHouse;
  }

  async updateUserHouse(userHouse: UserHouse) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const createdUserHouse = await queryRunner.manager.save(
      UserHouse,
      userHouse,
    );

    return createdUserHouse;
  }

  async getUsersHouseByHouseId(houseId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const usersFound = await queryRunner.manager.find(User, {
      where: {
        userHouses: {
          houseId: Equal(houseId),
        },
      },
    });

    return usersFound;
  }

  async getUserHouseByHouseIdUserId(houseId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

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
  }
}
