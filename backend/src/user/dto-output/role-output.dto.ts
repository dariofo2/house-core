import { ApiProperty } from '@nestjs/swagger';

export default class RoleOutputDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
