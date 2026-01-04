import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export default class CreateProductBatchDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  productId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ nullable: true, example: null })
  expirationDate: Date | null;
}
