import { IconProps } from "@/components/core/Icon";
import categories from "../data/categories";
import { Entity, Nestable } from "../types/DataTypes";
export interface Category extends Entity, Nestable {
  id: string;
  name: string;
  localizedName: { [key: string]: string };
  group?: string;
  parent?: string;
  level?: number;
  style?: {
    iconName?: string;
    bgColor?: string;
    textColor?: string;
  };
  icon?: IconProps;
  path?: string[];
}
class CategoriesApi {
  getAll() {
    return categories as Category[];
  }

  getById(id: string) {
    return (categories as Category[]).find(
      (c: Category) => c.id === id
    ) as Category;
  }
}

const categoriesApi = new CategoriesApi();

export default categoriesApi;
