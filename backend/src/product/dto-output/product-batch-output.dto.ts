import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class ProductBatchOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  productId: number;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty({ nullable: true })
  expirationDate: string | null;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
