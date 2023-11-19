import { AfterLoad, Column, Entity, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ERole } from '@/role/enum/roles.enum';
import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { Permission } from '@/role/entities/permission.entity';
import { JoinTable } from 'typeorm';
import { EState } from '@shared/enum/common.enum';
import { config } from '@/base/config';

@Entity()
export class User extends AbstractEntity {
  @Column('text', { array: true })
  avatar: string[];

  @AfterLoad()
  afterload() {
    if (this?.avatar?.length) {
      this.avatar = this.avatar.map((avt) => {
        return `http://${config.IP}:${config.PORT}/api/v${config.API_VERSION}/uploads/${avt}`;
      });
    }
  }
}
