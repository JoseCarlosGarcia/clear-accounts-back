import { DomainException, DomainErrorCode } from './domain.exception';

export class UnauthorizedException extends DomainException {
  readonly code = DomainErrorCode.UNAUTHORIZED;
}
