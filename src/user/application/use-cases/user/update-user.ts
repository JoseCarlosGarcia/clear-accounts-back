import { User } from "src/user/domain/entities/user";
import { IUserRepository } from "src/user/domain/repository/user";
import { RepeatUserException } from "src/user/domain/exceptions/user";
import { UpdateUserDto } from "../../dto/write/update-user";

interface Props {
  user: User;
  dto: UpdateUserDto;
}

export class UpdateUser {
  constructor(private readonly repository: IUserRepository) {}

  async execute({ dto: { email, name }, user }: Props): Promise<void> {
    const found = await this.repository.findByEmail(email);

    if (found && !found.deleted && found.id !== user.id) {
      throw new RepeatUserException();
    }

    user.email = email;
    user.name = name;

    await this.repository.update(user);
  }
}
