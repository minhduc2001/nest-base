import { AbstractEntity } from '@/base/service/abstract-entity.service';
import Permission from '@/permission/entities/permission.entity';
import User from '@/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
class Role extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  search_name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: true })
  deleteable: boolean;

  @TreeChildren()
  children: Role[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: Role;

  @ManyToMany(() => Permission, (p) => p.roles)
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}

export default Role;
