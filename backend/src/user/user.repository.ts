import { Injectable } from '@nestjs/common';
import User from 'src/db/entities/user/user.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class UserRepository {
  constructor(private readonly datasource: DataSource) {}

  async findUserByName(name: string) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    const userFound = await queryRunner.manager.findOne(User, {
      where: {
        name: Equal(name),
      },
      relations: {
        userRoles: { role: true },
      },
    });

    return userFound;
  }

  async getUsers() {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    const usersFound = await queryRunner.manager.find(User, {
      relations: {
        userRoles: { role: true },
      },
    });

    return usersFound;
  }

  async getUser(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    const userFound = await queryRunner.manager.findOne(User, {
      where: {
        id: Equal(id),
      },
    });

    return userFound;
  }

  async createUser(user: User) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    const userCreated = await queryRunner.manager.save(User, user);

    return userCreated;
  }

  async deleteUser(userId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    const userDeleted = await queryRunner.manager.delete(User, {
      id: userId,
    });

    return userDeleted;
  }

  async updateUser(user: User) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    const userFound = await queryRunner.manager.save(User, user);

    return userFound;
  }
}
