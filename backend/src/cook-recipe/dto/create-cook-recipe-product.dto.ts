import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export default class CreateCookRecipeProductDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  cookRecipeId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  productId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  quantity: number;
}
