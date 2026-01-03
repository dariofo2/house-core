import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import HouseRepository from './house.repository';
import User from 'src/db/entities/user/user.entity';
import CreateHouseDTO from './dto/create-house.dto';
import { plainToInstance } from 'class-transformer';
import House from 'src/db/entities/house/house.entity';
import UpdateHouseDTO from './dto/update-house.dto';
import { RoleName } from 'src/common/enum/role.enum';
import UserHouse from 'src/db/entities/house/user-house.entity';
import AddUserHouseDTO from './dto/add-user-house.dto';
import UpdateUserHouseDTO from './dto/update-user-house.dto';
import UserRepository from 'src/user/user.repository';

@Injectable()
export default class HouseService {
  logger = new Logger(HouseService.name);
  constructor(
    private readonly houseRepository: HouseRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getHouse(user: User, houseId: number) {
    const houseFound = await this.houseRepository.getHouseByUserId(
      houseId,
      user.id,
    );

    if (!houseFound) throw new BadRequestException('House Doesnt Exist');
    return houseFound;
  }

  async listHouses(user: User) {
    return await this.houseRepository.listUserHouses(user.id);
  }

  async listAllHouses() {
    return await this.houseRepository.listAllHouses();
  }

  async createHouse(user: User, createHouseDTO: CreateHouseDTO) {
    const createdHouse = await this.houseRepository.createHouse(
      plainToInstance(House, createHouseDTO),
    );

    const role = await this.userRepository.getRoleByName(RoleName.ADMIN);

    if (!role) throw new BadRequestException('Role doesnt exist in DB');
    const addUserHouse = new UserHouse();
    addUserHouse.houseId = createdHouse.id;
    addUserHouse.userId = user.id;
    addUserHouse.roleId = role?.id;

    const userHouseCreated =
      await this.houseRepository.addUserHouse(addUserHouse);

    if (!userHouseCreated)
      throw new BadRequestException('Couldnt relation User with House');
    return createdHouse;
  }

  async updateHouse(user: User, updateHouseDTO: UpdateHouseDTO) {
    const userHouseFound =
      await this.houseRepository.getUserHouseByHouseIdUserId(
        updateHouseDTO.id,
        user.id,
      );

    if (!userHouseFound)
      throw new BadRequestException(
        'You are not in that House or House doesnt Exist',
      );

    if ((userHouseFound.role.name as RoleName) != RoleName.ADMIN)
      throw new ForbiddenException('Only House Admins can Update House');

    return await this.houseRepository.updateHouse(
      plainToInstance(House, updateHouseDTO),
    );
  }

  async deleteHouse(user: User, houseId: number) {
    const userHouseFound =
      await this.houseRepository.getUserHouseByHouseIdUserId(houseId, user.id);

    if (!userHouseFound)
      throw new BadRequestException(
        'You are not in that House or House doesnt Exist',
      );

    if ((userHouseFound.role.name as RoleName) != RoleName.ADMIN)
      throw new ForbiddenException('Only House Admins can delete House');

    return await this.houseRepository.deleteHouse(houseId);
  }

  async addUserToHouse(user: User, addUserHouseDTO: AddUserHouseDTO) {
    //Admin TODO

    const userHouseFound =
      await this.houseRepository.getUserHouseByHouseIdUserId(
        addUserHouseDTO.houseId,
        user.id,
      );

    if (!userHouseFound)
      throw new BadRequestException(
        'You are not in that House or House doesnt Exist',
      );

    if ((userHouseFound.role.name as RoleName) != RoleName.ADMIN)
      throw new ForbiddenException('Only House Admins can add users To House');

    const userHouseToUpdate =
      await this.houseRepository.getUserHouseByHouseIdUserId(
        addUserHouseDTO.houseId,
        addUserHouseDTO.userId,
      );

    if (userHouseToUpdate)
      throw new BadRequestException(
        'That user is just in that house, cannot duplicate',
      );

    const role = await this.userRepository.getRoleByName(
      addUserHouseDTO.roleName,
    );

    if (!role) throw new BadRequestException('This role doesnt Exist in DB');

    const newUserHouse = new UserHouse();
    newUserHouse.houseId = addUserHouseDTO.houseId;
    newUserHouse.userId = addUserHouseDTO.userId;
    newUserHouse.roleId = role?.id;

    return await this.houseRepository.addUserHouse(newUserHouse);
  }

  async updateUserFromHouse(
    user: User,
    updateUserHouseDTO: UpdateUserHouseDTO,
  ) {
    //ADMIN TODO

    const userHouseFound =
      await this.houseRepository.getUserHouseByHouseIdUserId(
        updateUserHouseDTO.houseId,
        user.id,
      );

    if (!userHouseFound)
      throw new BadRequestException(
        'You are not in that House or House doesnt Exist',
      );

    if ((userHouseFound.role.name as RoleName) != RoleName.ADMIN)
      throw new ForbiddenException('Only House Admins can add users To House');

    const userHouseToUpdate =
      await this.houseRepository.getUserHouseByHouseIdUserId(
        updateUserHouseDTO.houseId,
        updateUserHouseDTO.userId,
      );

    if (!userHouseToUpdate)
      throw new BadRequestException('That user is Not from That House');

    const roleFound = await this.userRepository.getRoleByName(
      updateUserHouseDTO.roleName,
    );

    if (!roleFound)
      throw new BadRequestException('This role doesnt Exist in DB');

    userHouseToUpdate.roleId = roleFound.id;
    userHouseToUpdate.role = roleFound;

    this.logger.warn(userHouseToUpdate);
    return await this.houseRepository.updateUserHouse(userHouseToUpdate);
  }

  async deleteUserFromHouse(user: User, userId: number, houseId: number) {
    //ADMIN TODO

    const userHouseFound =
      await this.houseRepository.getUserHouseByHouseIdUserId(houseId, user.id);

    if (!userHouseFound)
      throw new BadRequestException(
        'You are not in that House or House doesnt Exist',
      );

    if ((userHouseFound.role.name as RoleName) != RoleName.ADMIN)
      throw new ForbiddenException('Only House Admins can add users To House');

    const userHouseToUpdate =
      await this.houseRepository.getUserHouseByHouseIdUserId(houseId, userId);

    if (!userHouseToUpdate)
      throw new BadRequestException('That user is Not from That House');

    return await this.houseRepository.deleteUserHouse(userHouseToUpdate.id);
  }
}
