import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class LoginDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  })
  password: string;
}
