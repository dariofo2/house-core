export interface UserHouseOutputDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  user: UserOutputDTO;
  role: RoleOutputDTO;
}
