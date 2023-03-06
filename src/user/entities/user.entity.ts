import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ERole } from '@/role/enum/roles.enum';
import { AbstractEntity } from '@/base/service/abstract-entity.service';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: false, unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, type: 'enum', enum: ERole, default: ERole.Guest })
  role: ERole;

  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, 10);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bcrypt.compareSync(rawPassword, userPassword);
  }
}
