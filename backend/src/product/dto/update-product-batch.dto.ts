import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export default class UpdateProductBatchDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ nullable: true, example: null })
  expirationDate: Date | null;
}
