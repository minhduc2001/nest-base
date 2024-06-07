export const defaultPayload = {
  success: true,
  status_code: 200,
  message: '',
  data: null,
};

export abstract class Payload<T> {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: T | null;

  constructor(partial: Payload<T>) {
    Object.assign(this, partial);
  }
}
