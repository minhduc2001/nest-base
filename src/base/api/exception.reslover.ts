import fs = require('fs');
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError as NestValidationError } from '@nestjs/common';

import { Payload, defaultPayload } from '@/base/api/api.schema';

/**
 * MODULE_ACTION_ERROR: xyz zzt
 * @param x {string}: module
 * @param y {number}: function
 * @param z {number}: error code in function
 * @param t {string}: first char of filename
 **/

// 99**** GLOBAL
export const SUCCESS = '000000';
export const UNKNOWN = '999999';
export const SYSTEM_ERROR = '990001';
// export const REQUIRE_LOGIN = '000002';
// export const UNKNOWN_METHOD = '000003';
// export const SEARCH_CHECK_KEYWORD = '000006';
// export const NOT_ENOUGH_PARAM = '000007';
// export const UNAUTHORIZED = '000011';

// 01**** VALIDATE
export const VALIDATION = '010009';

// 02**** DATABASE
export const NOT_FOUND = '020008';
export const DUPLICATE = '020010';
export const PROTECTED = '020012';
export const QUERY_DB_ERROR = '020013';

// 03**** BASE API
// 0001** CUSTOM APP API
// 0002** CUSTOM APP SERVICE

export const STATUS_CODE_MAP: Record<string, any> = {
  [HttpStatus.NOT_FOUND]: NOT_FOUND,
};

const ALL_MESSAGES: Record<string, string> = {
  [SUCCESS]: 'Success',
  [UNKNOWN]: 'Unknown error',
  [SYSTEM_ERROR]: 'Uh oh! Something went wrong. Please report to develop team.',
  // [REQUIRE_LOGIN]: 'Required login ',
  // [UNKNOWN_METHOD]: 'Unknown method',
  // [SEARCH_CHECK_KEYWORD]: 'Search check keyword',
  // [NOT_ENOUGH_PARAM]: 'Not enough param',
  // [UNAUTHORIZED]: 'Unauthorized account',
  [NOT_FOUND]: 'The requested information could not be found.',
  [VALIDATION]: 'Invalid input data.',
  [DUPLICATE]: 'Duplicate information.',
};
export const SUCCESS_MESSAGE = ALL_MESSAGES[SUCCESS];
const ALL_ERROR_CODE = Object.keys(ALL_MESSAGES);

const getMessageFromCode = (
  errorCode: string,
  defaultMessage: string,
): string => {
  let message = ALL_MESSAGES[errorCode] || '';
  if (!message) {
    const errorCodeWoutPrefix = ALL_ERROR_CODE.filter((item) =>
      errorCode.endsWith(item),
    );
    message = errorCodeWoutPrefix[0]
      ? ALL_MESSAGES[errorCodeWoutPrefix[0]]
      : message;
  }
  message = message || defaultMessage;
  if (!message)
    fs.writeFile(
      'error-codes-missing-message.log',
      errorCode + '\n',
      { flag: 'a' },
      () => {},
    );
  return message;
};

export abstract class BaseException<TData> extends HttpException {
  protected constructor(
    partial: Payload<TData>,
    statusCode: number,
    defaultMessage = '',
  ) {
    const payload = {
      ...defaultPayload,
      ...partial,
    };
    payload.success = payload.errorCode === SUCCESS && payload.message === '';
    payload.message =
      payload.message || getMessageFromCode(payload.errorCode, defaultMessage);
    super(payload, statusCode);
  }
}

/**
 * response to client an error
 * @example
 * throw new exc.BusinessException<number>({
    errorCode: 'USER011C',
    message: 'exc msg',
    data: 1
  });
 */
export class BusinessException<TData> extends BaseException<TData> {
  constructor(
    payload: Payload<TData>,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(payload, statusCode);
  }
}

export class BadRequest<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.BAD_REQUEST);
  }
}

export class Unauthorized<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.UNAUTHORIZED);
  }
}

export class Forbidden<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.FORBIDDEN);
  }
}

export class NotFound<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.NOT_FOUND, ALL_MESSAGES[NOT_FOUND]);
  }
}

export class MethodNotAllowed<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.METHOD_NOT_ALLOWED);
  }
}

export class NotAcceptable<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.NOT_ACCEPTABLE);
  }
}

export class Conflict<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.CONFLICT);
  }
}

export class UnsupportedMediaType<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(
      payload,
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      'Unsupported format file',
    );
  }
}

export class TemporaryRedirect<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(payload, HttpStatus.TEMPORARY_REDIRECT);
  }
}

export class PayloadTooLarge<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(
      payload,
      HttpStatus.PAYLOAD_TOO_LARGE,
      'Data exceeds the allowed size',
    );
  }
}

export class FailedDependency<TData> extends BaseException<TData> {
  constructor(payload: Payload<TData>) {
    super(
      payload,
      HttpStatus.FAILED_DEPENDENCY,
      'The request failed due to failure of a previous request.',
    );
  }
}

export class ValidationPartialError<TData> extends BadRequest<TData> {
  constructor(payload: Payload<TData>) {
    super({
      errorCode: VALIDATION,
      ...payload,
    });
  }
}

function reduceConstraintMsgs(
  validationErrors: NestValidationError[],
): string[] {
  return validationErrors.reduce((acc, cur) => {
    acc = acc.concat(Object.values(cur?.constraints || {}));

    if (cur?.children) acc = acc.concat(reduceConstraintMsgs(cur?.children));

    return acc;
  }, []);
}

const regex = /^[A-Z_]*[0-9]*$/;
export class ValidationError extends BadRequest<any[]> {
  constructor(validationErrors: NestValidationError[]) {
    let errorCode = VALIDATION;
    const constraintMsgs = reduceConstraintMsgs(validationErrors);
    const errorCodes = constraintMsgs
      .filter((message) => regex.test(message))
      .sort();

    if (errorCodes.length) errorCode = errorCodes[0];

    const payload: Payload<any[]> = {
      errorCode,
      message: ALL_MESSAGES[VALIDATION],
      data: validationErrors.reduce((acc, cur) => {
        if (acc.length === 0) {
          const item = { target: cur.target };
          delete cur.target;
          item['error'] = [cur];
          acc.push(item);
          return acc;
        }
        delete cur.target;
        acc[0]['error'].push(cur);
        return acc;
      }, []),
    };
    super(payload);
  }
}

export class QueryDbError extends BadRequest<any> {
  constructor(payload: Payload<any>) {
    super(payload);
  }
}
