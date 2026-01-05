import { ApiProperty } from '@nestjs/swagger';

export default class UserHouseOutputDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  houseId: number;

  @ApiProperty()
  roleId: number;

  @ApiProperty()
  user: string;

  @ApiProperty()
  house: string;

  @ApiProperty()
  role: string;
}
