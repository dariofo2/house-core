import { UserOutputDTO } from "./UserOutputDTO";

export interface LoginOutputDTO {
  refreshToken: string;
  accesToken: string;
  user: UserOutputDTO;
}
