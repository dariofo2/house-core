import { Test, TestingModule } from '@nestjs/testing';
import AuthService from './auth.service';
import UserRepository from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import User from 'src/database/entities/user/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    id: 1,
    name: 'testuser',
    password: 'hashedpassword',
  } as User;

  const mockUserRepository = {
    findUserByName: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto = { name: 'testuser', password: 'password123' };

    it('should return tokens and user if credentials are valid', async () => {
      mockUserRepository.findUserByName.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockConfigService.get.mockReturnValue('secret');
      mockJwtService.signAsync.mockResolvedValue('mocktoken');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('accesToken');
      expect(result.user).toEqual(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });

    it('should throw ForbiddenException if user not found', async () => {
      mockUserRepository.findUserByName.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password does not match', async () => {
      mockUserRepository.findUserByName.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('regenerateAccessToken', () => {
    it('should return a new access token if user found', async () => {
      mockUserRepository.findUserByName.mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('secret');
      mockJwtService.signAsync.mockResolvedValue('newtoken');

      const result = await service.regenerateAccessToken('testuser');

      expect(result).toContain('Bearer newtoken');
      expect(mockUserRepository.findUserByName).toHaveBeenCalledWith('testuser');
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findUserByName.mockResolvedValue(null);

      await expect(service.regenerateAccessToken('testuser')).rejects.toThrow('User Not Found');
    });
  });
});
