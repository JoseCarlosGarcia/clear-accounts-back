import { UserResponse } from "src/user/application/queries/responses/user.response";

export class SignInResponse {
  user: UserResponse;
  accessToken: string;
}
