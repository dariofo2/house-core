import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateUserPasswordDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  })
  lastPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  })
  newPassword: string;
}
