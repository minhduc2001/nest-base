import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

import UserPermission from './user-permission.entity';
import { UserStatus } from '../user.constant';
import Role from '@/role/entities/role.entity';
import Permission from '@/permission/entities/permission.entity';
import { config } from '@/base/config';
import Authenticate from '@/auth/entities/auth.entity';
import { AbstractEntity } from '@/base/service/abstract-entity.service';

@Entity()
@Index(['username', 'email', 'deleted_at'], { unique: true })
class User extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ default: '' })
  email: string;

  @Column({ nullable: true })
  email_verified_at: Date;

  @Column({ default: '', select: false })
  password: string;

  is_init_password: boolean;

  @Column({ default: UserStatus.ACTIVE, enum: UserStatus })
  status: UserStatus;

  @Column({ default: '', select: false })
  google_id: string;

  @Column({ default: '', select: false })
  facebook_id: string;

  @OneToMany(() => Authenticate, (auth) => auth.user)
  auths: Authenticate[];

  @Column({ nullable: true, default: new Date() })
  first_login: Date;

  @Column({ nullable: true })
  last_login: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => UserPermission, (up) => up.user)
  users_to_permissions: UserPermission[];

  permissions: Permission[];
  password_expires_at: any;

  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, config.PASSWORD_SALT);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bcrypt.compareSync(rawPassword, userPassword);
  }
}

export default User;
