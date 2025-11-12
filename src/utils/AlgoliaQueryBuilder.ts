import {
  Filter,
  Operation,
  Query,
  Sort,
  SortDirection,
} from "@/types/DataTypes";

export class QueryBuilder<T> {
  private readonly _query: Query;
  readonly filtersMap: Map<string, Filter<T>> = new Map();

  constructor(query?: Query) {
    if (query) {
      this._query = { ...query };
      if (query.filters) {
        query.filters.forEach((filter) =>
          this.filtersMap.set(filter.field, filter)
        );
      }
    } else {
      this._query = { filters: [], orderBy: [] };
    }
  }

  static fromQuery<T>(query: Query) {
    return new QueryBuilder<T>(query);
  }

  static from<T>(query: Partial<Query>) {
    const qb = new QueryBuilder<T>(query);
    !!query.limit && qb.limit(query.limit);
    !!query.filters && qb.filters(query.filters);
    !!query.orderBy && qb.orderByList(query.orderBy);
    // !!query.page && qb.page(query.page);
    return qb.build();
  }

  filter(
    field: string,
    value: any,
    operation: Operation = Operation.EQUAL
  ): QueryBuilder<T> {
    const filter: Filter<T> = { field, value, operation };
    this.filtersMap.set(field, filter);
    return this;
  }
  filters(filters: Filter<T>[]): QueryBuilder<T> {
    this._query.filters = filters;
    this.filtersMap.clear();
    filters.forEach((filter) => this.filtersMap.set(filter.field, filter));
    return this;
  }
  addToFilters(filters: Filter<T>[]): QueryBuilder<T> {
    filters.forEach((filter) => this.filtersMap.set(filter.field, filter));
    return this;
  }
  limit(limit: number): QueryBuilder<T> {
    this._query.limit = limit;
    return this;
  }
  searchText(text?: string): QueryBuilder<T> {
    this._query.searchText = text;
    return this;
  }
  location(location?: Query["location"]): QueryBuilder<T> {
    !!location && (this._query.location = location);
    return this;
  }
  after(doc?: Document): QueryBuilder<T> {
    if (doc) {
      this._query.afterDoc = doc;
    }
    return this;
  }
  orderBy(field: string, direction: SortDirection): QueryBuilder<T> {
    if (!this._query.orderBy) {
      this._query.orderBy = [];
    }

    this._query.orderBy.push({ field, direction });

    return this;
  }

  orderByList(sortList: Sort[]): QueryBuilder<T> {
    this._query.orderBy = sortList;
    return this;
  }

  build(): Query {
    this._query.filters = Array.from(this.filtersMap.values());
    return this._query;
  }

  static filterFrom = (
    field: string,
    value: string,
    operation: Operation = Operation.EQUAL
  ) => {
    return { field, operation, value } as Filter;
  };
  static queryFrom<T>(
    filters: Filter<T>[],
    limit: number = 100,
    orderBy?: Sort[]
  ) {
    return { filters, limit, orderBy };
  }

  static equal(q1?: Query, q2?: Query) {
    if (!!q1 && !!q2) {
      return JSON.stringify(q1) === JSON.stringify(q2);
    }
    return false;
  }

  static emptyQuery<T>() {
    return new QueryBuilder<T>().build();
  }
}
