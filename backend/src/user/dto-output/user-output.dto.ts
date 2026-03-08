import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import UserRoleOutputDTO from './user-role-output.dto';

export default class UserOutputDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: () => [UserRoleOutputDTO] })
  @Type(() => UserRoleOutputDTO)
  userRoles?: UserRoleOutputDTO[];
}
