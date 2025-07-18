import { Entity } from "../types/DataTypes";
import { DatabaseApi } from "./DatabaseApi";
import { Item } from "./itemsApi";

export interface ListItem extends Entity {
  item: Item;
  type: "wish" | "favorite";
  isAvailable?: boolean;
}

class ListsApi extends DatabaseApi<ListItem> {
  constructor() {
    super("lists");
  }
}

const listsApi = new ListsApi();

export default listsApi;
