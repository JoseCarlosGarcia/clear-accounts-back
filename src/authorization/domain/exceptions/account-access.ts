import { ForbiddenException } from 'src/shared/domain/exceptions/forbidden.exception';

export class NotAccountMemberException extends ForbiddenException {
  constructor() {
    super('not-account-member');
  }
}

export class InsufficientAccountRoleException extends ForbiddenException {
  constructor() {
    super('insufficient-account-role');
  }
}
