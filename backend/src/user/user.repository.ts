import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RoleName } from 'src/common/enum/role.enum';
import Role from 'src/database/entities/user/role.entity';
import UserRole from 'src/database/entities/user/user-role.entity';
import User from 'src/database/entities/user/user.entity';
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

  async saveUser(user: User) {
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

  async deleteUser(user: User) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const userDeleted = await queryRunner.manager.remove(User, user);

      return userDeleted;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  //USER ROLES
  async getUserRole(userId: number, roleId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      return await queryRunner.manager.findOne(UserRole, {
        where: {
          userId: userId,
          roleId: roleId,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async addUserRole(userId: number, roleId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      return await queryRunner.manager.save(UserRole, {
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

  async deleteUserRole(userRole: UserRole) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      return await queryRunner.manager.remove(UserRole, userRole);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUserRolesNamesArray(userId: number): Promise<RoleName[]> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const roles = await queryRunner.manager.find(Role, {
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

      return rolesEnumArray;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getUserRoles(userId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const roles = await queryRunner.manager.find(Role, {
        where: {
          usersRole: {
            userId: Equal(userId),
          },
        },
      });

      return roles;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  // ROLES
  async getRoles() {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      const roles = await queryRunner.manager.find(Role);

      return roles;
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
}
