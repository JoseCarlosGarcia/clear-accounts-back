import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationResponse } from '../responses/pagination.response';

/**
 * Documenta una respuesta paginada tipando `items` con el modelo indicado.
 * Los genéricos no existen en runtime, así que `PaginationResponse<T>` por sí
 * solo llega a Swagger como un array sin tipo.
 */
export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
