import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import RoleOutputDTO from 'src/user/dto-output/role-output.dto';
import UserOutputDTO from 'src/user/dto-output/user-output.dto';

export default class UserHouseOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: UserOutputDTO })
  user: UserOutputDTO;

  @Expose()
  @ApiProperty({ type: RoleOutputDTO })
  role: RoleOutputDTO;
}
