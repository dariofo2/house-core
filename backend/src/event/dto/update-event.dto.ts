import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateEventDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example event' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'description example event' })
  description: string;
}
