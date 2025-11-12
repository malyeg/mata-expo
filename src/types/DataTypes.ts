import { PublicUser } from "@/api/authApi";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FieldError as FieldErrorBase } from "react-hook-form";

export type DataCollection<
  T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData
> = FirebaseFirestoreTypes.CollectionReference<T>;

export type Field<T> = keyof T;

export type Document<T> = FirebaseFirestoreTypes.QueryDocumentSnapshot<T>;

export enum Operation {
  EQUAL = "==",
  NOT_EQUAL = "!=",
  GREATER_THAN = ">",
  GREATER_OR_EQUAL_THAN = ">=",
  LESS_THAN = "<",
  LESS_OR_EQUAL_THAN = ">=",
  IN = "in",
  NOT_IN = "not-in",
  CONTAINS = "array-contains", // model must implement DataSearchable
}

export type Filter<T = any> = {
  field: string;
  value: any;
  name?: string;
  operation?: Operation;
  readonly?: boolean;
};

export interface Page {
  size: number;
  index: number;
  totalPages: number;
  totalDocs: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface Query<T = any> {
  searchText?: string;
  filters?: Filter<T>[];
  limit?: number;
  orderBy?: Sort[];
  page?: {
    index: number;
    size: number;
  };
  afterDoc?: any;

  location?: {
    coordinate: Coordinate;
    aroundRadius?: number | "all";
  };
}

export interface SearchQuery {
  searchText?: string;
  filters?: Filter[];
  limit?: number;
  orderBy?: Sort[];
  page?: Page;

  location?: {
    coordinate: Coordinate;
    aroundRadius?: number | "all";
  };
}

export type Sort = {
  field: string;
  direction?: SortDirection;
};

export type SortDirection = "asc" | "desc" | undefined;

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

  static from<T extends Entity>(query: Partial<Query>) {
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

  static emptyQuery<T extends Entity>() {
    return new QueryBuilder<T>().build();
  }
}
export interface DataSearchable {
  searchArray?: string[];
}
export interface Identity {
  id: string;
  name: string;
}

export interface Nestable {
  parent?: string;
  level?: number;
  path?: string[];
  hasChildren?: boolean;
}
export interface Entity extends DataSearchable {
  // value: string;
  id: string;
  name?: string;
  timestamp?: Date;
  userId: string; // TODO remove (deprecated in favor of user)
  user?: PublicUser;
}

// Form types
export interface FieldError extends FieldErrorBase {
  code?: string;
  params?: { [key: string]: string | number };
}

export interface FormProps {
  name: string;
  control: any;
  defaultValue?: string | boolean | object;
}

export type PickerFieldItem = {
  value: string;
  label?: string;
  emoji?: string;
};

export interface Status {
  code?: string;
  message: string;
  type?: "warn" | "error" | "info" | "success";
  options?: {
    duration?: number;
    position?: "top" | "bottom";
    autoHide?: boolean;
  };
  params?: { [key: string]: string | number };
}
