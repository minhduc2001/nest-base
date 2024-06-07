import { Roles } from '@/role/role.constant';
import { RoleService } from '@/role/role.service';
import { OptionalUser, UserStatus } from '@/user/user.constant';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission: string[] = this.reflector.getAllAndOverride<
      Roles[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();

    const user: OptionalUser = request?.user;

    if (user?.status !== UserStatus.ACTIVE) {
      throw new NotAcceptableException('user.inactive');
    }

    if (!requiredPermission?.length) return true;

    const isValid: boolean = await this.roleService.can(
      user,
      requiredPermission,
    );

    if (!isValid) throw new ForbiddenException();

    return true;
  }
}
