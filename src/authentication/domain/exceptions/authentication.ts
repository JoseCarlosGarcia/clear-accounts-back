import { UnauthorizedException } from 'src/shared/domain/exceptions/unauthorized.exception';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('invalid-credentials');
  }
}
