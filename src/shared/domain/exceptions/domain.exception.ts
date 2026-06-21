export enum DomainErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
}

/**
 * Base de todas las excepciones de dominio. Es pura (extiende `Error`, sin Nest):
 * el mapeo a HTTP lo hace `DomainExceptionFilter` a partir de `code`.
 *
 * `field` es metadato opcional: indica qué recurso/campo provocó el error
 * (p. ej. 'email' en un duplicado), para que el cliente lo use en formularios.
 */
export abstract class DomainException extends Error {
  abstract readonly code: DomainErrorCode;
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = new.target.name;
    this.field = field;
  }
}
