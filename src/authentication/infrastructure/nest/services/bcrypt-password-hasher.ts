import * as bcryptjs from 'bcryptjs';
import { PasswordHasher } from 'src/authentication/domain/interfaces/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
  hash(plain: string): Promise<string> {
    return bcryptjs.hash(plain, 10);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(plain, hash);
  }
}
