import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import LoginDTO from './dto/login.dto';
import UserRepository from 'src/user/user.repository';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';
import User from 'src/database/entities/user/user.entity';

@Injectable()
export default class AuthService {
  readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Login Service
   * @param loginDTO
   * @returns Bearer JWT Token
   */
  async login(loginDTO: LoginDTO) {
    const userFound = await this.userRepository.findUserByName(loginDTO.name);

    if (!userFound) throw new UnauthorizedException('UserName Doesnt Exist');

    const passwdMatch = await compare(loginDTO.password, userFound.password);

    if (!passwdMatch) throw new UnauthorizedException('Incorrect Password');

    const refreshToken = await this.generateRefreshToken(userFound);
    const accesToken = await this.generateAccesToken(userFound);

    return { refreshToken: refreshToken, accesToken: accesToken };
  }

  async generateRefreshToken(user: User) {
    const jwtToken = await this.jwtService.signAsync(instanceToPlain(user), {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '30d',
    });

    return 'Bearer ' + jwtToken;
  }

  async generateAccesToken(user: User) {
    const jwtToken = await this.jwtService.signAsync(instanceToPlain(user), {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '10m',
    });

    return 'Bearer ' + jwtToken;
  }

  async regenerateAccessToken(userName: string) {
    const userFound = await this.userRepository.findUserByName(userName);

    if (!userFound) throw Error('User Not Found');

    return await this.generateAccesToken(userFound);
  }
}
