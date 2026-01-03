import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import CreateUserDTO from './dto/create-user.dto';
import UserRepository from './user.repository';
import { plainToInstance } from 'class-transformer';
import User from 'src/db/entities/user/user.entity';

@Injectable()
export default class UserService {
  readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

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
    const createdUser = await this.userRepository.createUser(
      plainToInstance(User, createUserDTO),
    );

    return createdUser;
  }

  async deleteUser(userId: number) {
    const deletedUser = await this.userRepository.deleteUser(userId);

    return deletedUser.raw as User;
  }

  async updateUser() {}
}
