import { DomainException, DomainErrorCode } from './domain.exception';

export class ForbiddenException extends DomainException {
  readonly code = DomainErrorCode.FORBIDDEN;
}
