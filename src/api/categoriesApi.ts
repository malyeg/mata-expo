import { IconProps } from "@/components/core/Icon";
import categories from "../data/categories";
import { Entity, LocalizedText, Nestable } from "../types/DataTypes";

export interface LocalizedPath {
  en: string[];
  ar: string[];
}
export interface Category extends Entity, Nestable {
  id: string;
  name: string;
  localizedName: LocalizedText;
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
  localizedPath?: LocalizedPath;
}
class CategoriesApi {
  getAll() {
    return categories as unknown as Category[];
  }

  getById(id: string) {
    const category = (categories as unknown as Category[]).find(
      (c: Category) => c.id === id
    ) as Category;
    if (category) {
      category.localizedPath = this.getLocalizedPath(category);
    }

    return category;
  }

  getLocalizedPath(category: Category) {
    const pathEn = [];
    const pathAr = [];
    let current = category;
    while (current) {
      pathEn.unshift(current.localizedName.en);
      pathAr.unshift(current.localizedName.ar);
      current = this.getById(current.parent!);
    }
    return {
      en: pathEn,
      ar: pathAr,
    };
  }
}

const categoriesApi = new CategoriesApi();

export default categoriesApi;
