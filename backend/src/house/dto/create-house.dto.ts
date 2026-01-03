import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateHouseDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'House' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Default example House' })
  description: string;
}
