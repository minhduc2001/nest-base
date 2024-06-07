import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IntersectionType } from '@nestjs/swagger/dist/type-helpers/intersection-type.helper';
import { Type } from '@nestjs/common';
import { enumToObj } from '../utils/convert';

export function enumProperty(options: ApiPropertyOptions): ApiPropertyOptions {
  const obj = enumToObj(options.enum);
  const enumValues = Object.values(obj);
  return {
    example: enumValues[0],
    ...options,
    enum: enumValues,
    description: (options.description ?? '') + ': ' + JSON.stringify(obj),
  };
}

export function IntersectionTypes(classARef, ...types) {
  return types.reduce(
    (acc: Type<any>, cur: Type<any>) => IntersectionType(acc, cur),
    classARef,
  );
}
