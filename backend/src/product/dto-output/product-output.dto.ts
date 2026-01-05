import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import ProductBatchOutputDTO from './product-batch-output.dto';

export default class ProductOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  subcategoryId: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ nullable: true })
  unity: string | null;

  @Expose()
  @ApiProperty()
  step: number;

  @Expose()
  @ApiProperty({ nullable: true })
  photo: string | null;

  @Expose()
  @ApiProperty()
  minQuantity: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: [ProductBatchOutputDTO] })
  productBatches: ProductBatchOutputDTO[];
}
