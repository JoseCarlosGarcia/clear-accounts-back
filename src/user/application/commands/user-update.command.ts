import { User } from "src/user/domain/entities/user.entity";
import { UpdateUserRequest } from "./requests/update-user.request";
import { UserUpdate } from "src/user/domain/services/user-update";

interface Props {
  user: User;
  request: UpdateUserRequest;
}

export class UserUpdateCommand {
  constructor(private readonly service: UserUpdate) {}

  async execute({ request, user }: Props): Promise<void> {
    await this.service.execute({
      user,
      email: request.email,
      name: request.name,
    })
  }
}
