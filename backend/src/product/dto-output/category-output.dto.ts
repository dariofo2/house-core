import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import SubcategoryOutputDTO from './subcategory-output.dto';

export default class CategoryOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  houseId: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty({ type: [SubcategoryOutputDTO] })
  subcategories: SubcategoryOutputDTO[];
}
