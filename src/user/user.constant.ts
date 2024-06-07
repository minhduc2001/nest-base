import { differenceBy } from 'lodash';
import Permission from '../permission/entities/permission.entity';
import Role from '../role/entities/role.entity';
import UserPermission from './entities/user-permission.entity';
import User from './entities/user.entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserPermissionType {
  ADDITIONAL = 'ADDITIONAL',
  RESTRICT = 'RESTRICT',
}

export type OptionalUser = User | undefined;

export interface GetAdditionAndRestrictPermission {
  addition: Permission[];
  restrict: Permission[];
}

export const getAdditionAndRestrictPermission = (
  ups: UserPermission[],
): GetAdditionAndRestrictPermission => {
  const { addition, restrict } = ups.reduce(
    (acc: GetAdditionAndRestrictPermission, up: UserPermission) => {
      switch (up.type) {
        case UserPermissionType.ADDITIONAL:
          acc.addition.push(up.permission);
          break;
        case UserPermissionType.RESTRICT:
          acc.restrict.push(up.permission);
          break;
        default:
          break;
      }

      return acc;
    },
    {
      addition: [],
      restrict: [],
    },
  );

  return { addition, restrict };
};

export const getAllUserPermission = (user: User): Permission[] => {
  let permissions: Permission[] = user.roles.flatMap(
    (role: Role) => role.permissions,
  );

  if (user?.users_to_permissions?.length) {
    const { addition, restrict }: GetAdditionAndRestrictPermission =
      getAdditionAndRestrictPermission(user.users_to_permissions);

    permissions = differenceBy([...permissions, ...addition], restrict, 'id');

    delete user.users_to_permissions;
  }

  return permissions;
};
