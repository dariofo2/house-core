import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateHouseDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'House Example' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'This is a House Example' })
  description: string;
}
