import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Permission from '../../permission/entities/permission.entity';
import User from './user.entity';
import { UserPermissionType } from '../user.constant';
import { AbstractEntity } from '@/base/service/abstract-entity.service';

@Entity({ name: 'users_permissions' })
class UserPermission extends AbstractEntity {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  permission_id: number;

  @PrimaryColumn({ enum: UserPermissionType })
  type: UserPermissionType;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.users_to_permissions)
  user: User;

  @JoinColumn({ name: 'permission_id' })
  @ManyToOne(() => Permission, (per) => per.users_to_permissions)
  permission: Permission;
}

export default UserPermission;
