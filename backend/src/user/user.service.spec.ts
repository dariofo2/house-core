import { Test, TestingModule } from '@nestjs/testing';
import UserService from './user.service';
import UserRepository from './user.repository';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import User from 'src/database/entities/user/user.entity';
import { RoleName } from 'src/common/enum/role.enum';
import Role from 'src/database/entities/user/role.entity';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let configService: ConfigService;

  const mockUser = { id: 1, name: 'testuser', password: 'hashedpassword' } as User;
  const mockAdminUser = { id: 2, name: 'admin' } as User;
  const mockRoleVisitor = { id: 1, name: RoleName.VISITOR } as Role;

  const mockUserRepository = {
    getUser: jest.fn(),
    getUsers: jest.fn(),
    saveUser: jest.fn(),
    deleteUser: jest.fn(),
    getRoleByName: jest.fn(),
    addUserRole: jest.fn(),
    getUserRolesNamesArray: jest.fn(),
    getUserRoles: jest.fn(),
    getUserRole: jest.fn(),
    deleteUserRole: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user if found', async () => {
      mockUserRepository.getUser.mockResolvedValue(mockUser);
      const result = await service.getUser(1);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if user not found', async () => {
      mockUserRepository.getUser.mockResolvedValue(null);
      await expect(service.getUser(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createUser', () => {
    const createDto = { name: 'new', email: 'new@test.com', password: 'password' };

    it('should create user if creation mode is enabled', async () => {
      mockConfigService.get.mockReturnValue('true');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockUserRepository.saveUser.mockResolvedValue({ id: 3, ...createDto });
      mockUserRepository.getRoleByName.mockResolvedValue(mockRoleVisitor);
      mockUserRepository.addUserRole.mockResolvedValue({});

      const result = await service.createUser(createDto);
      expect(result).toBeDefined();
      expect(userRepository.saveUser).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if creation mode is disabled', async () => {
      mockConfigService.get.mockReturnValue('false');
      await expect(service.createUser(createDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user if user is deleting themselves', async () => {
      mockUserRepository.getUserRolesNamesArray.mockResolvedValue([RoleName.USER]);
      mockUserRepository.getUser.mockResolvedValue(mockUser);
      mockUserRepository.deleteUser.mockResolvedValue(mockUser);

      const result = await service.deleteUser(mockUser, 1);
      expect(result).toBeDefined();
    });

    it('should delete user if requester is admin', async () => {
      mockUserRepository.getUserRolesNamesArray.mockResolvedValue([RoleName.ADMIN]);
      mockUserRepository.getUser.mockResolvedValue(mockUser);
      mockUserRepository.deleteUser.mockResolvedValue(mockUser);

      const result = await service.deleteUser(mockAdminUser, 1);
      expect(result).toBeDefined();
    });

    it('should throw UnauthorizedException if requester is not admin and deleting someone else', async () => {
      mockUserRepository.getUserRolesNamesArray.mockResolvedValue([RoleName.USER]);
      await expect(service.deleteUser(mockUser, 2)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateUserPassword', () => {
    const updatePwdDto = { id: 1, lastPassword: 'old', newPassword: 'new' };

    it('should update password if last password matches', async () => {
      mockUserRepository.getUserRolesNamesArray.mockResolvedValue([RoleName.USER]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
      mockUserRepository.saveUser.mockResolvedValue(mockUser);

      const result = await service.updateUserPassword(mockUser, updatePwdDto);
      expect(result).toBeDefined();
    });

    it('should throw UnauthorizedException if last password does not match', async () => {
      mockUserRepository.getUserRolesNamesArray.mockResolvedValue([RoleName.USER]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.updateUserPassword(mockUser, updatePwdDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should allow admin to update password without matching last password', async () => {
      mockUserRepository.getUserRolesNamesArray.mockResolvedValue([RoleName.ADMIN]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
      mockUserRepository.saveUser.mockResolvedValue(mockUser);

      const result = await service.updateUserPassword(mockAdminUser, updatePwdDto);
      expect(result).toBeDefined();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('addUserRole', () => {
    it('should add role if valid', async () => {
      mockUserRepository.getRoleByName.mockResolvedValue({ id: 1, name: RoleName.ADMIN });
      mockUserRepository.getUserRole.mockResolvedValue(null);
      mockUserRepository.getUser.mockResolvedValue(mockUser);
      mockUserRepository.addUserRole.mockResolvedValue({});

      const result = await service.addUserRole(1, RoleName.ADMIN);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if user already has role', async () => {
      mockUserRepository.getRoleByName.mockResolvedValue({ id: 1, name: RoleName.ADMIN });
      mockUserRepository.getUserRole.mockResolvedValue({ id: 1 });

      await expect(service.addUserRole(1, RoleName.ADMIN)).rejects.toThrow('User already Has that role');
    });
  });
});
