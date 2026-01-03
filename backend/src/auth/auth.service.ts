import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import LoginDTO from './dto/login.dto';
import UserRepository from 'src/user/user.repository';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';

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
  async login(loginDTO: LoginDTO): Promise<string> {
    const userFound = await this.userRepository.findUserByName(loginDTO.name);

    if (!userFound) throw new UnauthorizedException('UserName Doesnt Exist');

    const passwdMatch = await compare(loginDTO.password, userFound.password);

    if (!passwdMatch) throw new UnauthorizedException('Incorrect Password');

    const jwtToken = await this.jwtService.signAsync(
      instanceToPlain(userFound),
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    return 'Bearer ' + jwtToken;
  }

  async logout() {}
}
