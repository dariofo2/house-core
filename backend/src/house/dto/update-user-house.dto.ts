import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { RoleName } from 'src/common/enum/role.enum';

export default class UpdateUserHouseDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  houseId: number;

  @IsEnum(RoleName)
  @ApiProperty({ example: RoleName.ADMIN })
  roleName: RoleName;
}
