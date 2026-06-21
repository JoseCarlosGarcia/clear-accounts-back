import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import IdGenerator from '../interfaces/id.generator';

@Injectable()
export class UlidGenerator implements IdGenerator {
  create(): string {
    return ulid();
  }
}
