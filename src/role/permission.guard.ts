import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as exc from '@base/api/exception.reslover';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasPermission = user.permissions?.some((permission) =>
      permissions?.includes(permission),
    );

    if (!hasPermission)
      throw new exc.BadRequest({
        message: 'Permission denied!',
        statusCode: 400,
      });
    return true;
  }
}
