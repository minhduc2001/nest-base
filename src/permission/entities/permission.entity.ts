import { AbstractEntity } from '@/base/service/abstract-entity.service';
import Role from '@/role/entities/role.entity';
import UserPermission from '@/user/entities/user-permission.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Permission extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column()
  name: string;

  @Column({ default: '' })
  search_name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: true })
  enable: boolean;

  @OneToMany(() => UserPermission, (up) => up.permission)
  users_to_permissions: UserPermission[];

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}

export default Permission;
