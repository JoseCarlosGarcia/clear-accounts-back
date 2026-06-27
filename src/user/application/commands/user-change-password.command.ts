import { User } from 'src/user/domain/entities/user.entity';
import { ChangePasswordRequest } from './requests/change-password.request';
import { UserChangePassword } from 'src/user/domain/services/user-change-password';
import { Command } from 'src/shared/application/interfaces/command.interface';

interface Props {
  request: ChangePasswordRequest;
  user: User;
}

export class UserChangePasswordCommand implements Command<Props, void> {
  constructor(
    private readonly service: UserChangePassword,
  ) {}

  async execute({ request, user }: Props): Promise<void> {
    await this.service.execute({
      user,
      newPassword: request.password,
      oldPassword: request.oldPassword,
    })
  }
}
