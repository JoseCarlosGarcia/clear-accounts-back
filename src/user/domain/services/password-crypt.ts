import * as bcryptjs from 'bcryptjs';

interface Props {
  password: string;
}

export class PasswordCrypt {
  execute({ password }: Props): Promise<string> {
    return bcryptjs.hash(password, 10);
  }
}

