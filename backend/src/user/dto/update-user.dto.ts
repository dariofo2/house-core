import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateUserDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@admin.es' })
  email: string;
}
