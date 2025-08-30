import { RepeatUserException } from "../exceptions/user";
import { CreateUserProps, IUserRepository } from "../repository/user";
import { PasswordCrypt } from "./password-crypt";

export class UserCreator {
  constructor(
    private readonly repository: IUserRepository,
    private readonly hasher: PasswordCrypt,
  ) {}

  async execute({
    email, 
    password,
    name,
  }: CreateUserProps): Promise<number> {
    const found = await this.repository.findByEmail(email);

    if (found && !found.deleted) {
      throw new RepeatUserException();
    }

    const hashedpassword = await this.hasher.execute({ password: password });

    return await this.repository.create({
      email: email,
      name: name,
      password: hashedpassword,
    });
  }
}
