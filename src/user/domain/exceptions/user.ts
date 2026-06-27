import { ConflictException } from 'src/shared/domain/exceptions/conflict.exception';
import { NotFoundException } from 'src/shared/domain/exceptions/not-found.exception';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('user-not-found');
  }
}

export class RepeatUserException extends ConflictException {
  constructor() {
    super('repeat-user');
  }
}

export class NotEqualPasswordsException extends ConflictException {
  constructor() {
    super('not-equal-passwords');
  }
}

