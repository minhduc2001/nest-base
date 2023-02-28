export const defaultPayload = {
  success: true,
  errorCode: '000000',
  statusCode: 200,
  message: '',
  data: null,
  meta: {},
};

export abstract class Payload<T> {
  success?: boolean;
  errorCode?: string;
  statusCode?: number;
  message?: string;
  data?: T | null;

  constructor(partial: Payload<T>) {
    Object.assign(this, partial);
  }
}

// export class NullPayload extends Payload<null> {}
// export class StringPayload extends Payload<string> {}
// export class ObjectPayload extends Payload<Record<string, unknown>> {}
// export class ArrayPayload extends Payload<[]> {}
