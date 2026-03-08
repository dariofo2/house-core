import { Test, TestingModule } from '@nestjs/testing';
import HouseService from './house.service';
import HouseRepository from './house.repository';
import UserRepository from 'src/user/user.repository';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import User from 'src/database/entities/user/user.entity';
import House from 'src/database/entities/house/house.entity';
import UserHouse from 'src/database/entities/house/user-house.entity';
import { RoleName } from 'src/common/enum/role.enum';
import Role from 'src/database/entities/user/role.entity';

describe('HouseService', () => {
  let service: HouseService;
  let houseRepository: HouseRepository;
  let userRepository: UserRepository;

  const mockUser = { id: 1, name: 'Test User' } as User;
  const mockHouse = { id: 1, name: 'Test House' } as House;
  const mockRoleAdmin = { id: 1, name: RoleName.ADMIN } as Role;
  const mockRoleUser = { id: 2, name: RoleName.USER } as Role;
  const mockUserHouse = {
    id: 1,
    userId: 1,
    houseId: 1,
    role: mockRoleAdmin,
  } as UserHouse;

  const mockHouseRepository = {
    getHouseByUserId: jest.fn(),
    listUserHouses: jest.fn(),
    listAllHouses: jest.fn(),
    createHouse: jest.fn(),
    addUserHouse: jest.fn(),
    getUserHouse: jest.fn(),
    updateHouse: jest.fn(),
    deleteHouse: jest.fn(),
    getUsersHouseByHouseId: jest.fn(),
    updateUserHouse: jest.fn(),
    deleteUserHouse: jest.fn(),
  };

  const mockUserRepository = {
    getRoleByName: jest.fn(),
    findUserByNameOrEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HouseService,
        { provide: HouseRepository, useValue: mockHouseRepository },
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<HouseService>(HouseService);
    houseRepository = module.get<HouseRepository>(HouseRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHouse', () => {
    it('should return a house if found', async () => {
      mockHouseRepository.getHouseByUserId.mockResolvedValue(mockHouse);
      const result = await service.getHouse(mockUser, 1);
      expect(result).toBeDefined();
      expect(houseRepository.getHouseByUserId).toHaveBeenCalledWith(1, mockUser.id);
    });

    it('should throw BadRequestException if house not found', async () => {
      mockHouseRepository.getHouseByUserId.mockResolvedValue(null);
      await expect(service.getHouse(mockUser, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('listHouses', () => {
    it('should return a list of houses for a user', async () => {
      mockHouseRepository.listUserHouses.mockResolvedValue([mockHouse]);
      const result = await service.listHouses(mockUser);
      expect(result).toHaveLength(1);
      expect(houseRepository.listUserHouses).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('createHouse', () => {
    const createDto = { name: 'New House' };

    it('should create a house and assign user as admin', async () => {
      mockHouseRepository.createHouse.mockResolvedValue({ id: 1, ...createDto });
      mockUserRepository.getRoleByName.mockResolvedValue(mockRoleAdmin);
      mockHouseRepository.addUserHouse.mockResolvedValue(mockUserHouse);

      const result = await service.createHouse(mockUser, createDto);

      expect(result).toBeDefined();
      expect(userRepository.getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
      expect(houseRepository.addUserHouse).toHaveBeenCalled();
    });

    it('should throw BadRequestException if role admin not found', async () => {
      mockHouseRepository.createHouse.mockResolvedValue({ id: 1, ...createDto });
      mockUserRepository.getRoleByName.mockResolvedValue(null);

      await expect(service.createHouse(mockUser, createDto)).rejects.toThrow(
        'Role doesnt exist in DB',
      );
    });
  });

  describe('updateHouse', () => {
    const updateDto = { id: 1, name: 'Updated House' };

    it('should update house if user is admin', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValue(mockUserHouse);
      mockHouseRepository.updateHouse.mockResolvedValue(updateDto);

      const result = await service.updateHouse(mockUser, updateDto);
      expect(result).toBeDefined();
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValue({
        ...mockUserHouse,
        role: mockRoleUser,
      });

      await expect(service.updateHouse(mockUser, updateDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if user is not in house', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValue(null);

      await expect(service.updateHouse(mockUser, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteHouse', () => {
    it('should delete house if user is admin', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValue(mockUserHouse);
      mockHouseRepository.deleteHouse.mockResolvedValue({ affected: 1 });

      const result = await service.deleteHouse(mockUser, 1);
      expect(result).toBeDefined();
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValue({
        ...mockUserHouse,
        role: mockRoleUser,
      });

      await expect(service.deleteHouse(mockUser, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addUserToHouse', () => {
    const addUserDto = {
      houseId: 1,
      userIdentifier: 'newuser@test.com',
      roleName: RoleName.USER,
    };

    it('should add user to house if requester is admin', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(mockUserHouse); // Requester is admin
      mockUserRepository.findUserByNameOrEmail.mockResolvedValue({ id: 2, name: 'New User' });
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(null); // Target user not in house
      mockUserRepository.getRoleByName.mockResolvedValue(mockRoleUser);
      mockHouseRepository.addUserHouse.mockResolvedValue({});

      const result = await service.addUserToHouse(mockUser, addUserDto);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if target user already in house', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(mockUserHouse); // Requester is admin
      mockUserRepository.findUserByNameOrEmail.mockResolvedValue({ id: 2, name: 'New User' });
      mockHouseRepository.getUserHouse.mockResolvedValueOnce({ id: 2 }); // Target user already in house

      await expect(service.addUserToHouse(mockUser, addUserDto)).rejects.toThrow(
        'That user is just in that house, cannot duplicate',
      );
    });

    it('should throw BadRequestException if target user not found', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(mockUserHouse);
      mockUserRepository.findUserByNameOrEmail.mockResolvedValue(null);

      await expect(service.addUserToHouse(mockUser, addUserDto)).rejects.toThrow(
        'User doesnt Exist',
      );
    });
  });

  describe('updateUserFromHouse', () => {
    const updateDto = { houseId: 1, userId: 2, roleName: RoleName.ADMIN };

    it('should update user role if requester is admin', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(mockUserHouse); // Requester is admin
      mockHouseRepository.getUserHouse.mockResolvedValueOnce({ id: 2, userId: 2 }); // Target user
      mockUserRepository.getRoleByName.mockResolvedValue(mockRoleAdmin);
      mockHouseRepository.updateUserHouse.mockResolvedValue({});

      const result = await service.updateUserFromHouse(mockUser, updateDto);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if target user not in house', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(mockUserHouse);
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(null);

      await expect(service.updateUserFromHouse(mockUser, updateDto)).rejects.toThrow(
        'That user is Not from That House',
      );
    });
  });

  describe('deleteUserFromHouse', () => {
    it('should delete user from house if requester is admin', async () => {
      mockHouseRepository.getUserHouse.mockResolvedValueOnce(mockUserHouse); // Requester is admin
      mockHouseRepository.getUserHouse.mockResolvedValueOnce({ id: 2, userId: 2 }); // Target user
      mockHouseRepository.deleteUserHouse.mockResolvedValue({ affected: 1 });

      const result = await service.deleteUserFromHouse(mockUser, 2, 1);
      expect(result).toBeDefined();
    });
  });

  describe('Permission checks', () => {
    describe('checkIfUserisOnHouseAndAdmin', () => {
      it('should not throw if user is admin', async () => {
        mockHouseRepository.getUserHouse.mockResolvedValue(mockUserHouse);
        await expect(service.checkIfUserisOnHouseAndAdmin(mockUser, 1)).resolves.not.toThrow();
      });

      it('should throw ForbiddenException if user is not admin', async () => {
        mockHouseRepository.getUserHouse.mockResolvedValue({ ...mockUserHouse, role: mockRoleUser });
        await expect(service.checkIfUserisOnHouseAndAdmin(mockUser, 1)).rejects.toThrow(
          ForbiddenException,
        );
      });
    });

    describe('checkIfUserisOnHouse', () => {
      it('should not throw if user is in house', async () => {
        mockHouseRepository.getUserHouse.mockResolvedValue(mockUserHouse);
        await expect(service.checkIfUserisOnHouse(mockUser, 1)).resolves.not.toThrow();
      });

      it('should throw BadRequestException if user is not in house', async () => {
        mockHouseRepository.getUserHouse.mockResolvedValue(null);
        await expect(service.checkIfUserisOnHouse(mockUser, 1)).rejects.toThrow(BadRequestException);
      });
    });
  });
});
