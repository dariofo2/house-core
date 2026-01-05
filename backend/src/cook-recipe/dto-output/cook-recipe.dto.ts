import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import CookRecipeProductOutputDTO from './cook-recipe-product.dto';

export default class CookRecipeOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty({ type: [String] })
  steps: string[];

  @Expose()
  @ApiProperty({ type: [CookRecipeProductOutputDTO] })
  cookRecipeProducts: CookRecipeProductOutputDTO[];
}
