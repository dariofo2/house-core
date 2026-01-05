import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export default class CreateProductBatchDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  productId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  quantity: number;

  @IsOptional()
  @ApiProperty({ nullable: true, example: null })
  expirationDate: Date | null;
}
