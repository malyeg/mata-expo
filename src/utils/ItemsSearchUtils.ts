import { Category } from "@/api/categoriesApi";
import { swapList } from "@/api/itemsApi";
import categories from "@/data/categories";
import { Operation, Query } from "@/types/DataTypes";

export type ItemsParams = {
  id?: string;
  action?: "OPEN_FILTER";
  categoryId?: string;
  countryId?: string;
  stateId?: string;
  swapOptionType?: string;
  conditionType?: string;
  // filters?: ItemsFilterForm;
};

export const getQueryFromParams = (params: ItemsParams) => {
  const query: Query = { filters: [] };
  if (params.countryId) {
    query.filters?.push({
      field: "countryId",
      value: params.countryId,
      operation: Operation.EQUAL,
    });
  }

  if (params.categoryId) {
    const category = categories.find(
      (c) => c.id === params.categoryId
    ) as unknown as Category;

    query.filters?.push({
      id: category.id,
      field: "catLevel1,catLevel2,catLevel3",
      value: category.name,
      operation: Operation.EQUAL,
    });
  }

  if (params?.conditionType) {
    query.filters?.push({
      field: "conditionType",
      value: params.conditionType,
      operation: Operation.EQUAL,
    });
  }

  if (params.countryId) {
    query.filters?.push({
      field: "countryId",
      value: params.countryId,
      operation: Operation.EQUAL,
    });
  }

  if (params?.stateId) {
    query.filters?.push({
      field: "location.state.id",
      value: JSON.parse(params.stateId)?.id,
      operation: Operation.EQUAL,
    });
  }
  if (params?.swapOptionType) {
    const swapType = swapList.filter(
      (c) => c.id === params.swapOptionType?.toString()
    );
    query.filters?.push({
      field: "swapOptionType",
      value: swapType[0].id,
      operation: Operation.EQUAL,
    });
  }

  return query;
};

export const getParamsFromQuery = (query: Query): ItemsParams => {
  const params: ItemsParams = {};

  if (!query.filters) {
    return params;
  }

  const categoryFilter = query.filters.find(
    (f) => f.field === "catLevel1,catLevel2,catLevel3"
  );
  if (categoryFilter && categoryFilter.id) {
    params.categoryId = categoryFilter.id;
  }

  const conditionFilter = query.filters.find(
    (f) => f.field === "conditionType"
  );
  if (conditionFilter) {
    params.conditionType = conditionFilter.value;
  }

  const countryFilter = query.filters.find((f) => f.field === "countryId");
  if (countryFilter) {
    params.countryId = countryFilter.value;
  }

  const stateFilter = query.filters.find(
    (f) => f.field === "location.state.id"
  );
  if (stateFilter) {
    params.stateId = JSON.stringify({ id: stateFilter.value });
  }

  const swapFilter = query.filters.find((f) => f.field === "swapOptionType");
  if (swapFilter) {
    params.swapOptionType = swapFilter.value;
  }

  return params;
};
