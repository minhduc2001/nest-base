import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import User from '@/user/entities/user.entity';
import Permission from '@/permission/entities/permission.entity';
import { UserStatus } from '@/user/user.constant';

const data: Partial<User>[] = [
  {
    username: 'admin',
    email: 'admin@admin.com',
    password: '123123',
    full_name: 'Ngô Minh Đức',
    status: UserStatus.ACTIVE,
  },
];
@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    @InjectRepository(Permission)
    protected readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    const count = await this.repository.count();
    if (!count) {
      for (const user of data) {
        const _user = this.repository.create(user);
        _user.setPassword(user.password);
        await _user.save();
      }
    }
  }
}
