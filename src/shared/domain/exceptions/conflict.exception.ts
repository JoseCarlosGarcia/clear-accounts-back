import { DomainException, DomainErrorCode } from './domain.exception';

export class ConflictException extends DomainException {
  readonly code = DomainErrorCode.CONFLICT;
}
