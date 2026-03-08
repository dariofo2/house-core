import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import RoleOutputDTO from './role-output.dto';

export default class UserRoleOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  userId: number;

  @Expose()
  @ApiProperty()
  roleId: number;

  @Expose()
  @ApiProperty({ type: () => RoleOutputDTO })
  @Type(() => RoleOutputDTO)
  role: RoleOutputDTO;
}
