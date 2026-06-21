import { DomainException, DomainErrorCode } from './domain.exception';

export class NotFoundException extends DomainException {
  readonly code = DomainErrorCode.NOT_FOUND;
}
