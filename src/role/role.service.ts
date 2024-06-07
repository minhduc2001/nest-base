import UserPermission from '@/user/entities/user-permission.entity';
import User from '@/user/entities/user.entity';
import {
  GetAdditionAndRestrictPermission,
  getAdditionAndRestrictPermission,
} from '@/user/user.constant';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Role from './entities/role.entity';
import { Roles } from './role.constant';
import { differenceBy } from 'lodash';
import Permission from '@/permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  async can(user: User, permissions: string[]): Promise<boolean> {
    const { roles } = user;

    const ups: UserPermission[] = await this.userPermissionRepository
      .createQueryBuilder('ups')
      .where('ups.user_id = :user_id', { user_id: user.id })
      .leftJoinAndSelect(
        'ups.permission',
        'permission',
        'permission.enable = true',
      )
      .select(['ups', 'permission.id', 'permission.name'])
      .getMany();

    const { addition, restrict }: GetAdditionAndRestrictPermission =
      getAdditionAndRestrictPermission(ups);

    const valid: boolean[] = await Promise.all(
      roles.flatMap(async (r: Role) => {
        if (!r.is_active) return false;
        if (r.name === Roles.ADMIN) return true;

        r = await this.roleRepository
          .createQueryBuilder('role')
          .where('role.id = :id', { id: r.id })
          .leftJoinAndSelect(
            'role.permissions',
            'permissions',
            'permissions.enable = true',
          )
          .select(['role', 'permissions.id', 'permissions.name'])
          .getOne();

        const isPermission: boolean = differenceBy(
          [...r.permissions, ...addition],
          restrict,
          'id',
        ).some((p: Permission) => permissions.includes(p.name));

        return isPermission;
      }),
    );

    return valid.some((v: boolean) => v);
  }
}
