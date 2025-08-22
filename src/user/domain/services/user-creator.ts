import { RepeatUserException } from "../exceptions/user";
import { CreateUserProps, IUserRepository } from "../repository/user";

export class UserCreator {
  constructor(
    private readonly repository: IUserRepository,
  ) {}

  async execute({
    email, 
    password,
    name,
    birthday
  }: CreateUserProps): Promise<void> {
    const found = await this.repository.findByEmail(email);

    if (found && !found.deleted) {
      throw new RepeatUserException();
    }

    //const password = await this.hasher.execute({ password: ipassword });

    await this.repository.create({
      email: email,
      name: name,
      password: password,
      birthday: birthday
    });
  }
}
