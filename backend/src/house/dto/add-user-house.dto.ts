import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { RoleName } from 'src/common/enum/role.enum';

export default class AddUserHouseDTO {
  @IsString()
  @ApiProperty({ example: 'dario@example.com' })
  userIdentifier: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  houseId: number;

  @IsEnum(RoleName)
  @ApiProperty({ example: RoleName.VISITOR })
  roleName: RoleName;
}
