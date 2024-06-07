import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Payload, defaultPayload } from '@base/api/api.schema';
import { LoggerService } from '../logger';
import { config } from '../config';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Payload<T>>
{
  private logger = new LoggerService().getLogger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Payload<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, ip, url } = request;

    const now: number = Date.now();

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();

        const delay: number = Date.now() - now;

        const message: string = `${method} ${url} ${response.statusCode} - ${ip} +${delay}ms`;

        const isSlow: boolean = delay > 1000;

        if (isSlow) this.logger.warn(message);

        if (!isSlow && !config.IS_PRODUCTION) {
          this.logger.log(message);
        }

        return {
          ...defaultPayload,
          data: data ?? null,
        };
      }),
    );
  }
}
