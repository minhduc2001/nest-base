import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// BASE
import * as exc from '@/base/api/exception.reslover';
import { LoggerService } from '@base/logger';
import { BaseService } from '@/base/service/base.service';

// APPS
import { User } from '@/user/entities/user.entity';
import {
  ICreateUser,
  IUserGetByUniqueKey,
} from '@/user/interfaces/user.interface';

import { ListUserDto, UploadAvatarDto } from './dtos/user.dto';
import { PaginateConfig } from '@base/service/paginate/paginate';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly loggerService: LoggerService,
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(UserService.name);

  getUserByUniqueKey(option: IUserGetByUniqueKey): Promise<User> {
    const findOption: Record<string, any>[] = Object.entries(option).map(
      ([key, value]) => ({ [key]: value }),
    );
    return this.repository
      .createQueryBuilder('user')
      .where(findOption)
      .getOne();
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: id } });
  }

  async createUser(data: string[]) {
    const user: User = this.repository.create({ avatar: data });
    await user.save();
  }

  async getAllUser(query: ListUserDto) {
    const config: PaginateConfig<User> = {
      sortableColumns: ['id'],
    };

    return this.listWithPage(query, config);
  }
}
