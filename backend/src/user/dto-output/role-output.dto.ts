import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class RoleOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;
}
