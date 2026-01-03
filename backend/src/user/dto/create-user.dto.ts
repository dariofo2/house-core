import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Benito' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '7cy546rtyusd' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Benito@benito.es' })
  email: string;
}
