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

    return userFound;
  }

  async listUsers() {
    const usersFound = await this.userRepository.getUsers();

    return usersFound;
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const userCreationMode = String(
      this.configService.get('USER_CREATION_MODE'),
    );
    if (userCreationMode === 'false')
      throw new UnauthorizedException('Only Admins can Create User');

    createUserDTO.password = await hash(createUserDTO.password, 4);

    const createdUser = await this.userRepository.createUser(
      plainToInstance(User, createUserDTO),
    );

    await this.userRepository.addUserRole(createdUser.id, RoleName.VISITOR);

    return createdUser;
  }

  async createUserAdmin(createUserDTO: CreateUserDTO) {
    createUserDTO.password = await hash(createUserDTO.password, 4);

    const createdUser = await this.userRepository.createUser(
      plainToInstance(User, createUserDTO),
    );

    await this.userRepository.addUserRole(createdUser.id, RoleName.VISITOR);
    return createdUser;
  }

  async deleteUser(user: User, userId: number) {
    const roles: RoleName[] = await this.userRepository.getUserRoles(user.id);
    if (user.id != userId)
      if (!roles.includes(RoleName.ADMIN))
        throw new UnauthorizedException(
          'Cant delete a User that is not You if not Admin',
        );

    const deletedUser = await this.userRepository.deleteUser(userId);

    return deletedUser.raw as User;
  }

  async updateUser(user: User, updateUserDTO: UpdateUserDTO) {
    const roles = await this.userRepository.getUserRoles(user.id);

    if (user.id != updateUserDTO.id && !roles.includes(RoleName.ADMIN))
      throw new ForbiddenException(
        'You are Not Allowed to Update other User If not Admin',
      );

    return await this.userRepository.updateUser(
      plainToInstance(User, updateUserDTO),
    );
  }

  async updateUserPassword(
    user: User,
    updateUserPasswordDTO: UpdateUserPasswordDTO,
  ) {
    const roles = await this.userRepository.getUserRoles(user.id);

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

    return await this.userRepository.updateUser(newUser);
  }

  async addUserRole(userId: number, roleName: RoleName) {
    const roles = await this.userRepository.getUserRoles(userId);
    if (roles.includes(roleName))
      throw new BadRequestException('The user just Has That Role');

    return await this.userRepository.addUserRole(userId, roleName);
  }

  async deleteUserRole(userId: number, roleName: RoleName) {
    const roles = await this.userRepository.getUserRoles(userId);
    if (!roles.includes(roleName))
      throw new BadRequestException('User Doesnt Has That Role');

    const roleFound = await this.userRepository.getRoleByName(roleName);

    if (!roleFound) throw new BadRequestException('Role doesnt Exist');

    return await this.userRepository.deleteUserRole(userId, roleFound.id);
  }
}
