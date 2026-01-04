import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateSubcategoryDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'categoryExample' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'category Description Example' })
  description: string;
}
