import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginateQuery } from '@base/service/paginate/paginate.interface';
import { paginate, PaginateConfig } from '@base/service/paginate/paginate';

export abstract class BaseService<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async listWithPage(
    query: PaginateQuery,
    config: PaginateConfig<T>,
    customQuery?: Repository<T> | SelectQueryBuilder<T>,
  ) {
    if (customQuery) {
      return paginate<T>(query, customQuery, config);
    }
    return paginate<T>(query, this.repository, config);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return await this.repository.findAndCount(options);
  }

  //   async findById(id: number): Promise<T> {
  //     return await this.repository.findOne({ where: { id: id } });
  //   }

  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async update(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
