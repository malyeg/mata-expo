import { Query } from "@/types/DataTypes";
import { LoggerFactory } from "@/utils/logger";
import { ApiResponse } from "../Api";
import { Category } from "../categoriesApi";
import { Item, ItemStatus } from "../itemsApi";
import SearchApi from "./searchApi";

interface SearchItem {
  objectID: string;
  name: string;
  catLevel1: string;
  catLevel2: string;
  catLevel3: string;
  conditionType: string;
  countryId: number;
  stateId: number;
  status: string;
  swapCategory: string;
  swapOptionType: string;
  defaultImageURL: string;
  timestamp: number;
  _geoloc: {
    lat: number;
    lng: number;
  };
  offers: Item["offers"];
}
const logger = LoggerFactory.getLogger("ItemsSearchApi");
class ItemsSearchApi extends SearchApi<SearchItem> {
  async search(query: Query) {
    try {
      const resp = await super.search(query);
      const items = resp?.items.map((i) => {
        const item: Item = this.itemMapper(i);
        return item;
      });
      return { ...resp, items } as ApiResponse<Item>;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  itemMapper(searchItem: SearchItem) {
    const category: Category = {
      name:
        searchItem.catLevel3 ?? searchItem.catLevel2 ?? searchItem.catLevel1,
      path: [searchItem.catLevel1, searchItem.catLevel2, searchItem.catLevel3],
    };
    const item: any = {
      id: searchItem.objectID,
      name: searchItem.name,
      category,
      status: "online" as ItemStatus,
      condition: { type: searchItem.conditionType },
      defaultImageURL: searchItem.defaultImageURL,
      location: {
        coordinate: {
          latitude: searchItem._geoloc.lat,
          longitude: searchItem._geoloc.lng,
        },
      },
      offers: searchItem.offers,
      swapOption: {
        type: searchItem.swapOptionType,
      },
    };
    return item as Item;
  }
}

const itemsSearchApi = new ItemsSearchApi("items");

export default itemsSearchApi;
