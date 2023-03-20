// copyright belongs to pettzold/nestjs-paginate, edited by minhduc2001
import {
  Repository,
  SelectQueryBuilder,
  Brackets,
  FindOptionsWhere,
  FindOptionsRelations,
  ObjectLiteral,
  FindOptionsUtils,
} from 'typeorm';
import { PaginateQuery } from './paginate.interface';
import { ServiceUnavailableException, Logger } from '@nestjs/common';
import { WherePredicateOperator } from 'typeorm/query-builder/WhereClause';
import {
  checkIsRelation,
  checkIsEmbedded,
  Column,
  extractVirtualProperty,
  fixColumnAlias,
  getPropertiesByColumnName,
  Order,
  positiveNumberOrDefault,
  RelationColumn,
  SortBy,
  hasColumnWithPropertyPath,
  includesAllPrimaryKeyColumns,
  isEntityKey,
} from './paginate.helper';
import { addFilter, FilterOperator, FilterSuffix } from './paginate.filter';

const logger: Logger = new Logger('nestjs-paginate');

export { FilterOperator, FilterSuffix };

export class Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: SortBy<T>;
    searchBy: Column<T>[];
    search: string;
    filter?: { [column: string]: string | string[] };
  };
}

export interface PaginateConfig<T> {
  relations?: FindOptionsRelations<T> | RelationColumn<T>[];
  sortableColumns: Column<T>[];
  nullSort?: 'first' | 'last';
  searchableColumns?: Column<T>[];
  select?: Column<T>[] | string[];
  maxLimit?: number;
  defaultSortBy?: SortBy<T>;
  defaultLimit?: number;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  filterableColumns?: {
    [key in Column<T> | string]?: (FilterOperator | FilterSuffix)[] | true;
  };
  loadEagerRelations?: boolean;
  withDeleted?: boolean;
  relativePath?: boolean;
  origin?: string;
}

export const DEFAULT_MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 20;
export const NO_PAGINATION = 0;

export async function paginate<T extends ObjectLiteral>(
  query: PaginateQuery,
  repo: Repository<T> | SelectQueryBuilder<T>,
  config: PaginateConfig<T>,
): Promise<Paginated<T>> {
  const page = positiveNumberOrDefault(query.page, 1, 1);

  const defaultLimit = config.defaultLimit || DEFAULT_LIMIT;
  const maxLimit = positiveNumberOrDefault(config.maxLimit, DEFAULT_MAX_LIMIT);
  const queryLimit = positiveNumberOrDefault(query.limit, defaultLimit);

  const isPaginated = !(
    queryLimit === NO_PAGINATION && maxLimit === NO_PAGINATION
  );

  const limit = isPaginated
    ? Math.min(queryLimit || defaultLimit, maxLimit || DEFAULT_MAX_LIMIT)
    : NO_PAGINATION;

  const sortBy = [] as SortBy<T>;
  const searchBy: Column<T>[] = [];

  let [items, totalItems]: [T[], number] = [[], 0];

  const queryBuilder =
    repo instanceof Repository ? repo.createQueryBuilder('__root') : repo;

  if (
    repo instanceof Repository &&
    !config.relations &&
    config.loadEagerRelations === true
  ) {
    if (!config.relations) {
      FindOptionsUtils.joinEagerRelations(
        queryBuilder,
        queryBuilder.alias,
        repo.metadata,
      );
    }
  }

  if (isPaginated) {
    queryBuilder.limit(limit).offset((page - 1) * limit);
  }

  if (config.relations) {
    // relations: ["relation"]
    if (Array.isArray(config.relations)) {
      config.relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(
          `${queryBuilder.alias}.${relation}`,
          `${queryBuilder.alias}_${relation}`,
        );
      });
    } else {
      // relations: {relation:true}
      const createQueryBuilderRelations = (
        prefix: string,
        relations: FindOptionsRelations<T> | RelationColumn<T>[],
        alias?: string,
      ) => {
        Object.keys(relations).forEach((relationName) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const relationSchema = relations![relationName]!;

          queryBuilder.leftJoinAndSelect(
            `${alias ?? prefix}.${relationName}`,
            `${alias ?? prefix}_${relationName}`,
          );

          if (typeof relationSchema === 'object') {
            createQueryBuilderRelations(
              relationName,
              relationSchema,
              `${prefix}_${relationName}`,
            );
          }
        });
      };
      createQueryBuilderRelations(queryBuilder.alias, config.relations);
    }
  }

  let nullSort: 'NULLS LAST' | 'NULLS FIRST' | undefined = undefined;
  if (config.nullSort) {
    nullSort = config.nullSort === 'last' ? 'NULLS LAST' : 'NULLS FIRST';
  }

  if (config.sortableColumns.length < 1) {
    logger.debug("Missing required 'sortableColumns' config.");
    throw new ServiceUnavailableException();
  }

  if (query.sortBy) {
    for (const order of query.sortBy) {
      if (
        isEntityKey(config.sortableColumns, order[0]) &&
        ['ASC', 'DESC'].includes(order[1])
      ) {
        sortBy.push(order as Order<T>);
      }
    }
  }

  if (!sortBy.length) {
    sortBy.push(
      ...(config.defaultSortBy || [[config.sortableColumns[0], 'ASC']]),
    );
  }

  for (const order of sortBy) {
    const columnProperties = getPropertiesByColumnName(order[0]);
    const { isVirtualProperty } = extractVirtualProperty(
      queryBuilder,
      columnProperties,
    );
    const isRelation = checkIsRelation(
      queryBuilder,
      columnProperties.propertyPath,
    );
    const isEmbeded = checkIsEmbedded(
      queryBuilder,
      columnProperties.propertyPath,
    );
    let alias = fixColumnAlias(
      columnProperties,
      queryBuilder.alias,
      isRelation,
      isVirtualProperty,
      isEmbeded,
    );
    if (isVirtualProperty) {
      alias = `"${alias}"`;
    }
    queryBuilder.addOrderBy(alias, order[1], nullSort);
  }

  // When we partial select the columns (main or relation) we must add the primary key column otherwise
  // typeorm will not be able to map the result.
  const selectParams = config.select || query.select;
  if (
    selectParams?.length > 0 &&
    includesAllPrimaryKeyColumns(queryBuilder, selectParams)
  ) {
    const cols: string[] = selectParams.reduce((cols, currentCol) => {
      if (query.select?.includes(currentCol) ?? true) {
        const columnProperties = getPropertiesByColumnName(currentCol);
        const isRelation = checkIsRelation(
          queryBuilder,
          columnProperties.propertyPath,
        );
        const { isVirtualProperty } = extractVirtualProperty(
          queryBuilder,
          columnProperties,
        );
        if (
          hasColumnWithPropertyPath(queryBuilder, columnProperties) ||
          isVirtualProperty
        ) {
          // here we can avoid to manually fix and add the query of virtual columns
          cols.push(
            fixColumnAlias(columnProperties, queryBuilder.alias, isRelation),
          );
        }
      }
      return cols;
    }, []);
    queryBuilder.select(cols);
  }

  if (config.where) {
    queryBuilder.andWhere(new Brackets((qb) => qb.andWhere(config.where)));
  }

  if (config.withDeleted) {
    queryBuilder.withDeleted();
  }

  if (config.searchableColumns) {
    if (query.searchBy) {
      for (const column of query.searchBy) {
        if (isEntityKey(config.searchableColumns, column)) {
          searchBy.push(column);
        }
      }
    } else {
      searchBy.push(...config.searchableColumns);
    }
  }

  if (query.search && searchBy.length) {
    queryBuilder.andWhere(
      new Brackets((qb: SelectQueryBuilder<T>) => {
        for (const column of searchBy) {
          const property = getPropertiesByColumnName(column);
          const { isVirtualProperty, query: virtualQuery } =
            extractVirtualProperty(qb, property);
          const isRelation = checkIsRelation(qb, property.propertyPath);
          const isEmbeded = checkIsEmbedded(qb, property.propertyPath);
          const alias = fixColumnAlias(
            property,
            qb.alias,
            isRelation,
            isVirtualProperty,
            isEmbeded,
            virtualQuery,
          );

          const condition: WherePredicateOperator = {
            operator: 'ilike',
            parameters: [`unaccent(${alias})`, `unaccent(:${property.column})`],
          };

          if (
            ['postgres', 'cockroachdb'].includes(
              queryBuilder.connection.options.type,
            )
          ) {
            condition.parameters[0] = `CAST(${condition.parameters[0]} AS text)`;
          }

          qb.orWhere(qb['createWhereConditionExpression'](condition), {
            [property.column]: `%${query.search}%`,
          });
        }
      }),
    );
  }

  if (query.filter) {
    addFilter(queryBuilder, query, config.filterableColumns);
  }

  if (isPaginated) {
    [items, totalItems] = await queryBuilder.getManyAndCount();
  } else {
    items = await queryBuilder.getMany();
  }

  const totalPages = isPaginated ? Math.ceil(totalItems / limit) : 1;

  const results: Paginated<T> = {
    data: items,
    meta: {
      itemsPerPage: isPaginated ? limit : items.length,
      totalItems: isPaginated ? totalItems : items.length,
      currentPage: page,
      totalPages,
      sortBy,
      search: query.search,
      searchBy: query.search ? searchBy : undefined,
      filter: query.filter,
    },
  };

  return Object.assign(new Paginated<T>(), results);
}
