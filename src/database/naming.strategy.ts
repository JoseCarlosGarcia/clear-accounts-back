import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/**
 * Estrategia de nombres de la base de datos.
 *
 * - Convierte clases y propiedades a snake_case (createdAt -> created_at).
 * - Quita el sufijo "Model" del nombre de la clase para derivar el nombre de
 *   tabla (UserModel -> user). Si la entidad declara un nombre explicito en
 *   @Entity({ name: '...' }), ese gana.
 */
export class AppNamingStrategy extends SnakeNamingStrategy {
  tableName(className: string, customName: string): string {
    if (customName) {
      return customName;
    }

    const nameWithoutModel = className.endsWith('Model')
      ? className.slice(0, -5)
      : className;

    return super.tableName(nameWithoutModel, customName);
  }
}
