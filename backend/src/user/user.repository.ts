import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RoleName } from 'src/common/enum/role.enum';
import Role from 'src/db/entities/user/role.entity';
import RoleEntity from 'src/db/entities/user/role.entity';
import UserRole from 'src/db/entities/user/user-role.entity';
import User from 'src/db/entities/user/user.entity';
import { DataSource, Equal } from 'typeorm';

@Injectable()
export default class UserRepository {
  logger = new Logger(UserRepository.name);
  constructor(private readonly datasource: DataSource) {}

  async findUserByName(name: string) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const userFound = await queryRunner.manager.findOne(User, {
        where: {
          name: Equal(name),
        },
        relations: {
          userRoles: { role: true },
        },
      });

      return userFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUsers() {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const usersFound = await queryRunner.manager.find(User, {
        relations: {
          userRoles: { role: true },
        },
      });

      return usersFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const userFound = await queryRunner.manager.findOne(User, {
        where: {
          id: Equal(id),
        },
      });

      return userFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createUser(user: User) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const userCreated = await queryRunner.manager.save(User, user);

      return userCreated;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUser(userId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const userDeleted = await queryRunner.manager.delete(User, {
        id: userId,
      });

      return userDeleted;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(user: User) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const userFound = await queryRunner.manager.save(User, user);

      return userFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async addUserRole(userId: number, role: RoleName) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const roleFound = await queryRunner.manager.findOne(RoleEntity, {
        where: {
          name: Equal(role),
        },
      });

      if (!roleFound) throw new BadRequestException('Role doesnt Exist in DB');

      const userFound = await queryRunner.manager.findOne(User, {
        where: {
          id: Equal(userId),
        },
      });

      if (!userFound) throw new BadRequestException('User Doesnt Exist');

      await queryRunner.manager.save(UserRole, {
        userId: userId,
        roleId: roleFound.id,
      });

      return userFound;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getRoleByName(roleName: RoleName) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      return await queryRunner.manager.findOne(Role, {
        where: {
          name: Equal(roleName),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUserRole(userId: number, roleId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      return await queryRunner.manager.delete(UserRole, {
        userId: userId,
        roleId: roleId,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUserRoles(userId: number): Promise<RoleName[]> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const roles = await queryRunner.manager.find(RoleEntity, {
        where: {
          usersRole: {
            userId: Equal(userId),
          },
        },
      });

      const rolesEnumArray: RoleName[] = [];
      for (const role of roles) {
        rolesEnumArray.push(role.name as RoleName);
      }

      await queryRunner.release();
      return rolesEnumArray;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getRoles() {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    const roles = await queryRunner.manager.find(Role);

    await queryRunner.release();
    return roles;
  }
}
