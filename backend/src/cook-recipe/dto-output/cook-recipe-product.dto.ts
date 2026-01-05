import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import ProductOutputDTO from 'src/product/dto-output/product-output.dto';

export default class CookRecipeProductOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  cookRecipeId: number;

  @Expose()
  @ApiProperty()
  productId: number;

  @Expose()
  @ApiProperty({ type: [ProductOutputDTO] })
  products: ProductOutputDTO[];
}
