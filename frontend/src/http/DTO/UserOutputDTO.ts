export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  role: Role;
}

export interface UserOutputDTO {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  userRoles?: UserRole[];
}
