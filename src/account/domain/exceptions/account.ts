import { ConflictException } from 'src/shared/domain/exceptions/conflict.exception';
import { NotFoundException } from 'src/shared/domain/exceptions/not-found.exception';

export class AccountNotFoundException extends NotFoundException {
  constructor() {
    super('account-not-found');
  }
}

export class AccountRequiresOwnerException extends ConflictException {
  constructor() {
    super('account-requires-owner');
  }
}

export class LastMemberCannotBeRemovedException extends ConflictException {
  constructor() {
    super('last-member-cannot-be-removed');
  }
}

export class AccountMembershipNotFoundException extends ConflictException {
  constructor() {
    super('account-membership-not-found');
  }
}

export class UserAlreadyMemberException extends ConflictException {
  constructor() {
    super('user-already-member');
  }
}

export class AccountAlreadyActiveException extends ConflictException {
  constructor() {
    super('account-already-active');
  }
}