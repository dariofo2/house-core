import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleName } from 'src/common/enum/role.enum';
import Role from 'src/db/entities/user/role.entity';
import RoleEntity from 'src/db/entities/user/role.entity';
import UserRole from 'src/db/entities/user/user-role.entity';
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

  async addUserRole(userId: number, role: RoleName) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

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
  }

  async getRoleByName(roleName: RoleName) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    return await queryRunner.manager.findOne(Role, {
      where: {
        name: Equal(roleName),
      },
    });
  }

  async deleteUserRole(userId: number, roleId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    return await queryRunner.manager.delete(UserRole, {
      userId: userId,
      roleId: roleId,
    });
  }

  async getUserRoles(userId: number): Promise<RoleName[]> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

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

    return rolesEnumArray;
  }
}
