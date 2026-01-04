import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateProductDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'product Example' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'product Example' })
  description: string;

  @ApiProperty({ nullable: true, example: null })
  unity?: string;

  @ApiProperty({ nullable: true, example: null })
  step?: number;

  @ApiProperty({ nullable: true, example: null })
  photo?: string;

  @ApiProperty({ nullable: true, example: null })
  minQuantity?: number;
}
