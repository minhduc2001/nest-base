import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiOperationOptions,
  ApiProperty,
  ApiPropertyOptions,
  ApiTags,
} from '@nestjs/swagger';
import { enumProperty } from './swagger.helper';
import { config } from '../config';
import { applyDecorators } from '@nestjs/common';

export * from '@nestjs/swagger';

const createApiOperation = (defaultOptions: ApiOperationOptions) => {
  return (options?: ApiOperationOptions): MethodDecorator =>
    ApiOperation({
      ...defaultOptions,
      ...options,
    });
};

export const ApiEnumProperty = (options: ApiPropertyOptions) =>
  ApiProperty(enumProperty(options));
export const ApiListOperation = createApiOperation({ summary: 'List all' });
export const ApiRetrieveOperation = createApiOperation({
  summary: 'Get information a record',
});
export const ApiCreateOperation = createApiOperation({ summary: 'Create new' });
export const ApiUpdateOperation = createApiOperation({
  summary: 'Edit a record',
});
export const ApiDeleteOperation = createApiOperation({
  summary: 'Delete a record',
});
export const ApiBulkDeleteOperation = createApiOperation({
  summary: 'Delete multiple records',
});

const header = config.IS_PRODUCTION
  ? ApiBearerAuth()
  : ApiHeader({
      name: 'Authorization',
      enum: config.BEARER_TEST,
      description: JSON.stringify(config.BEARER_TEST),
    });

export function ApiTagsAndBearer(...tags: string[]) {
  return applyDecorators(ApiBearerAuth(), ApiTags(...tags), header);
}
