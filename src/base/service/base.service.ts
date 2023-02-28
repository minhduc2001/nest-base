// import { FindManyOptions, Repository } from 'typeorm';

// export class PaginationOptions {
//   page?: number = 1;
//   limit?: number = 10;
//   sort?: string = 'createdAt';
//   order?: 'ASC' | 'DESC' = 'DESC';
// }

// export abstract class BasePaginationService<T> {
//   constructor(protected readonly repository: Repository<T>) {}

//   async findAllWithOptions(
//     paginationOptions: PaginationOptions,
//     filter?: FindManyOptions<T>,
//   ): Promise<{ data: T[]; count: number }> {
//     const { page, limit, sort, order } = paginationOptions;
//     const skip = (page - 1) * limit;
//     const [data, count] = await this.repository.findAndCount({
//       ...filter,
//       skip,
//       take: limit,
//       order: {
//         [sort]: order,
//       },
//     });
//     return { data, count };
//   }
// }

// export abstract class BaseCrudService<T> {
//   constructor(protected readonly repository: Repository<T>) {}

//   async findAll(filter: FindManyOptions<T>): Promise<T[]> {
//     return this.repository.find(filter);
//   }

//   async findOne(id: string): Promise<T> {
//     return this.repository.findOne(id);
//   }

//   async create(data: Partial<T>): Promise<T> {
//     const newEntity = this.repository.create(data);
//     return this.repository.save(newEntity);
//   }

//   async update(id: string, data: Partial<T>): Promise<T> {
//     const entity = await this.repository.findOne(id);
//     if (!entity) {
//       throw new Error(`Entity with id ${id} not found`);
//     }
//     this.repository.merge(entity, data);
//     return this.repository.save(entity);
//   }

//   async delete(id: string): Promise<void> {
//     const result = await this.repository.delete(id);
//     if (result.affected === 0) {
//       throw new Error(`Entity with id ${id} not found`);
//     }
//   }
// }
