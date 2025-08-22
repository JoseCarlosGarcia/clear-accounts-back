import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends HttpException {
  constructor() {
    super(``, HttpStatus.NOT_FOUND);
  }
}

export class RepeatUserException extends HttpException {
  constructor() {
    super(``, HttpStatus.CONFLICT);
  }
}

export class NotEqualPasswordsException extends HttpException {
  constructor() {
    super(``, HttpStatus.CONFLICT);
  }
}
