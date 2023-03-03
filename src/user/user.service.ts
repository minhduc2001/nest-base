import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// BASE
import * as exc from '@/base/api/exception.reslover';

// APPS
import { User } from '@/user/entities/user.entity';
import {
  ICreateUser,
  IUserGetByUniqueKey,
} from '@/user/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  getUserByUniqueKey(option: IUserGetByUniqueKey): Promise<User> {
    const findOption: Record<string, any>[] = Object.entries(option).map(
      ([key, value]) => ({ [key]: value }),
    );
    return this.repository
      .createQueryBuilder('user')
      .where(findOption)
      .getOne();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username: username } });
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: id } });
  }

  async createUser(dto: ICreateUser) {
    const user: User = this.repository.create(dto);
    user.setPassword(dto.password);
    await user.save();
  }

  async getAllUser() {
    return this.repository.find();
  }
}
