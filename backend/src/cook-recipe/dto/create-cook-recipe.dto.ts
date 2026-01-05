import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateCookRecipeDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  houseId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'cook Recipe Example' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'cook Recipe Example' })
  description: string;

  @IsArray()
  @ApiProperty({
    type: 'array',
    example: ['1. step 1', '2. step 2', '3. step 3'],
  })
  steps: string[];

  @IsOptional()
  photo?: string | null;
}
