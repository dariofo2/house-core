import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import ProductOutputDTO from './product-output.dto';

export default class SubcategoryOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  categoryId: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty({ type: [ProductOutputDTO] })
  products: ProductOutputDTO[];
}
