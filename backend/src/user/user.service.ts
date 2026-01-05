import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import CreateUserDTO from './dto/create-user.dto';
import UserRepository from './user.repository';
import { plainToInstance } from 'class-transformer';
import User from 'src/database/entities/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { RoleName } from 'src/common/enum/role.enum';
import UpdateUserDTO from './dto/update-user.dto';
import UpdateUserPasswordDTO from './dto/update-user-password.dto';
import { compare, hash } from 'bcrypt';
import UserOutputDTO from './dto-output/user-output.dto';
import RoleOutputDTO from './dto-output/role-output.dto';

@Injectable()
export default class UserService {
  readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async getUser(userId: number) {
    const userFound = await this.userRepository.getUser(userId);

    if (!userFound) throw new BadRequestException('User Not Found');

    const userConv = plainToInstance(UserOutputDTO, userFound, {
      excludeExtraneousValues: true,
    });

    return userConv;
  }

  async listUsers() {
    const usersFound = await this.userRepository.getUsers();

    return plainToInstance(UserOutputDTO, usersFound, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const userCreationMode = String(
      this.configService.get('USER_CREATION_MODE'),
    );
    if (userCreationMode === 'false')
      throw new UnauthorizedException('Only Admins can Create User');

    createUserDTO.password = await hash(createUserDTO.password, 4);

    const createdUser = await this.userRepository.createUser(
      plainToInstance(User, createUserDTO, { excludeExtraneousValues: true }),
    );

    //Role Assign Visitor
    const visitorRoleFound = await this.userRepository.getRoleByName(
      RoleName.VISITOR,
    );
    if (!visitorRoleFound)
      throw new BadRequestException('Visitor Role doesnt Exist in DB');

    await this.userRepository.addUserRole(createdUser.id, visitorRoleFound.id);

    return plainToInstance(UserOutputDTO, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async createUserAdmin(createUserDTO: CreateUserDTO) {
    createUserDTO.password = await hash(createUserDTO.password, 4);

    const createdUser = await this.userRepository.createUser(
      plainToInstance(User, createUserDTO, { excludeExtraneousValues: true }),
    );

    //Role Assign Visitor
    const visitorRoleFound = await this.userRepository.getRoleByName(
      RoleName.VISITOR,
    );
    if (!visitorRoleFound)
      throw new BadRequestException('Visitor Role doesnt Exist in DB');

    await this.userRepository.addUserRole(createdUser.id, visitorRoleFound.id);

    return plainToInstance(UserOutputDTO, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUser(user: User, userId: number) {
    const roles: RoleName[] = await this.userRepository.getUserRolesNamesArray(
      user.id,
    );
    if (user.id != userId)
      if (!roles.includes(RoleName.ADMIN))
        throw new UnauthorizedException(
          'Cant delete a User that is not You if not Admin',
        );

    const foundUser = await this.userRepository.getUser(userId);
    if (!foundUser) throw new BadRequestException('User Doesnt exist in DB');

    const deletedUser = await this.userRepository.deleteUser(foundUser);
    if (!deletedUser.affected)
      throw new BadRequestException('Couldnt Delete nothing');

    return plainToInstance(UserOutputDTO, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(user: User, updateUserDTO: UpdateUserDTO) {
    const roles = await this.userRepository.getUserRolesNamesArray(user.id);

    if (user.id != updateUserDTO.id && !roles.includes(RoleName.ADMIN))
      throw new ForbiddenException(
        'You are Not Allowed to Update other User If not Admin',
      );

    const updatedUser = await this.userRepository.updateUser(
      plainToInstance(User, updateUserDTO),
    );

    return plainToInstance(UserOutputDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateUserPassword(
    user: User,
    updateUserPasswordDTO: UpdateUserPasswordDTO,
  ) {
    const roles = await this.userRepository.getUserRolesNamesArray(user.id);

    if (user.id != updateUserPasswordDTO.id && !roles.includes(RoleName.ADMIN))
      throw new ForbiddenException(
        'You are Not Allowed to Update other User than Yourself If not Admin',
      );

    const newUser = new User();
    newUser.id = updateUserPasswordDTO.id;
    newUser.password = await hash(updateUserPasswordDTO.newPassword, 4);

    if (!roles.includes(RoleName.ADMIN)) {
      const passwordMatch = await compare(
        updateUserPasswordDTO.lastPassword,
        user.password,
      );
      if (!passwordMatch)
        throw new UnauthorizedException('Last Password doesnt Match');
    }

    const updatedUser = await this.userRepository.updateUser(newUser);

    return plainToInstance(UserOutputDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  //USER ROLES
  async getUserRoles(user: User, userId: number) {
    const foundRoles = await this.userRepository.getUserRoles(userId);

    return plainToInstance(RoleOutputDTO, foundRoles, {
      excludeExtraneousValues: true,
    });
  }

  async addUserRole(userId: number, roleName: RoleName) {
    const roleFound = await this.userRepository.getRoleByName(roleName);
    if (!roleFound) throw new BadRequestException('Role doesnt Exist in DB');

    const userRoleFound = await this.userRepository.getUserRole(
      userId,
      roleFound?.id,
    );
    if (userRoleFound)
      throw new BadRequestException('User already Has that role');

    const userFound = await this.userRepository.getUser(userId);
    if (!userFound) throw new BadRequestException('User doesnt Exist in DB');

    await this.userRepository.addUserRole(userId, roleFound.id);

    return plainToInstance(RoleOutputDTO, roleFound, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUserRole(userId: number, roleName: RoleName) {
    const roleFound = await this.userRepository.getRoleByName(roleName);
    if (!roleFound) throw new BadRequestException('Role doesnt Exist');

    const userRoleFound = await this.userRepository.getUserRole(
      userId,
      roleFound.id,
    );

    if (!userRoleFound)
      throw new BadRequestException(
        'Relation of this user and Role Doesnt Exist',
      );

    const deletedUserRole =
      await this.userRepository.deleteUserRole(userRoleFound);
    if (!deletedUserRole.affected)
      throw new BadRequestException('Couldnt Delete Relation');

    return plainToInstance(RoleOutputDTO, roleFound, {
      excludeExtraneousValues: true,
    });
  }
}
