import * as bcryptjs from 'bcryptjs';

interface Props {
  hashed: string;
  compare: string;
}

export class PasswordCompare {
  execute({ compare, hashed }: Props): Promise<boolean> {
    return bcryptjs.compare(compare, hashed);
  }
}

