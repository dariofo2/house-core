import { ApiProperty } from '@nestjs/swagger';

export default class HouseOutputDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  categories: string;
}
