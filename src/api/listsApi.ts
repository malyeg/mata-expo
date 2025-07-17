import {Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';
import {Item} from './itemsApi';

export interface ListItem extends Entity {
  item: Item;
  type: 'wish' | 'favorite';
  isAvailable?: boolean;
}

class ListsApi extends DataApi<ListItem> {
  constructor() {
    super('lists');
  }
}

const listsApi = new ListsApi();

export default listsApi;
