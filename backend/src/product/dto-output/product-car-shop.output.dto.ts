import { ApiProperty } from '@nestjs/swagger';

export default class ProductCarShopOutputDTO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  unity: string;

  @ApiProperty({ type: Number })
  step: number;

  @ApiProperty({ type: String, nullable: true })
  photo?: string | null;

  @ApiProperty({ type: Number })
  minQuantity: number;

  @ApiProperty({ type: Number })
  quantity: number;
}
