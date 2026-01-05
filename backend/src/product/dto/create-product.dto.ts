import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateProductDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  subcategoryId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  houseId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'product Example' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'product Example' })
  description: string;

  @IsOptional()
  @ApiProperty({ nullable: true, example: null })
  unity?: string | null;

  @IsOptional()
  @ApiProperty({ example: 1 })
  step?: number;

  @IsOptional()
  @ApiProperty({ nullable: true, example: null })
  photo?: string | null;

  @IsOptional()
  @ApiProperty({ example: 1 })
  minQuantity?: number;
}
