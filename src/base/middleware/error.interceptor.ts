import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../logger';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private logger = new LoggerService().getLogger('HTTP');

  nested(rest: Record<string, any>, node: any) {
    if (node.constraints) {
      rest = { ...rest, ...node.constraints };
    }

    if (node.children && node.children.length) {
      node.children.forEach((child: any[]) => {
        rest = this.nested(rest, child);
      });
    }

    return rest;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, ip, url, user } = request;

    const now: number = Date.now();

    const i18n: I18nContext = I18nContext.current();

    return next.handle().pipe(
      catchError((error) => {
        const delay: number = Date.now() - now;

        let message: string | string[] =
          error?.response?.message || error?.message;

        if (error?.errors && error?.status === HttpStatus.BAD_REQUEST) {
          const nMessage = [];

          error.errors.forEach((node: any) => {
            Object.entries(this.nested({}, node)).forEach(([, value]) => {
              const [key, val]: string[] = (value as string).split('|');

              const args: Record<string, string> = JSON.parse(
                val || JSON.stringify({}),
              );

              const msg: string = i18n.t(key, {
                lang: i18n.lang,
                args,
              });

              nMessage.push({
                [args.name || args.field || args.constraints]: msg,
              });
            });
          });

          message = nMessage;
        }

        const status: number =
          error?.status ||
          error?.response?.status ||
          error?.response?.statusCode ||
          HttpStatus.BAD_REQUEST;

        this.logger.error(`${method} ${url} ${status} - ${ip} +${delay}ms`, {
          message,
        });

        switch (status) {
          case HttpStatus.BAD_REQUEST:
            return throwError(() => new BadRequestException(message));
          case HttpStatus.FORBIDDEN:
            return throwError(() => new ForbiddenException(message));
          case HttpStatus.NOT_FOUND:
            return throwError(() => new NotFoundException(message));
          case HttpStatus.NOT_ACCEPTABLE:
            return throwError(() => new NotAcceptableException(message));
          case HttpStatus.INTERNAL_SERVER_ERROR:
            return throwError(() => new InternalServerErrorException(message));
          default:
            return throwError(() => new BadRequestException(message));
        }
      }),
    );
  }
}
