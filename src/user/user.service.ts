import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// BASE
import { LoggerService } from '@base/logger';
import { BaseService } from '@/base/service/base.service';

// APPS
import User from './entities/user.entity';
import { Request } from 'express';
import { LoginDto } from '@/auth/dtos/login.dto';
import { I18nContext } from 'nestjs-i18n';
import { NotAcceptable, NotFound } from '@/base/api/exception.reslover';
import { UserStatus } from './user.constant';

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

  async findOne(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username: username } });
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: id } });
  }

  async getUserWithStrategy(id: number, request: Request): Promise<User> {
    return null;
  }

  async getUserForLogin(
    { username, password }: LoginDto,
    i18n: I18nContext,
  ): Promise<User> {
    const user: User = await this.repository.findOne({
      where: { username },
      select: ['id', 'password', 'email', 'status'],
    });
    if (!user) return NotFound('user', i18n);
    if (!user.comparePassword(password)) return NotFound('user', i18n);

    if (user?.status !== UserStatus.ACTIVE) {
      return NotAcceptable('user.inactive', i18n);
    }

    return user;
  }
}
