import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PERMISSIONS,
  PERMISSIONS_DESC,
} from '@shared/constants/permission.constant';
import Permission from '@/permission/entities/permission.entity';

const data = [
  {
    name: PERMISSIONS.DELETE_USER,
    description: PERMISSIONS_DESC[PERMISSIONS.DELETE_USER],
  },
];

@Injectable()
export class PermissionSeed {
  constructor(
    @InjectRepository(Permission)
    protected readonly repository: Repository<Permission>,
  ) {}

  async seed() {
    const count = await this.repository.count();
    if (!count) {
      for (const permission of data) {
        await this.repository.save(permission);
      }
    }
  }
}
