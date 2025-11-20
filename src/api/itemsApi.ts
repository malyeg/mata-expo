import crashlytics from "@react-native-firebase/crashlytics";
import storage from "@react-native-firebase/storage";
import constants from "../config/constants";
import invalidContent from "../data/invalidContent";
import { functions } from "../firebase";
import { DataSearchable, Entity } from "../types/DataTypes";
import Analytics, { AnalyticsEvent } from "../utils/Analytics";
import { PublicUser } from "./authApi";
import { Category } from "./categoriesApi";
import { DatabaseApi } from "./DatabaseApi";
import { Location } from "./locationApi";

export type ItemStatus =
  | "draft"
  | "online"
  | "pending"
  | "archived"
  | "blocked";
export type ConditionType = "new" | "goodAsNew" | "used" | "usedWithIssues";
export type SwapType = "free" | "swapWithAnother" | "swapWithAny";

export const conditionList: { id: ConditionType; name: string }[] = [
  {
    id: "new",
    name: "New",
  },
  {
    id: "goodAsNew",
    name: "Good As New",
  },
  {
    id: "used",
    name: "Used",
  },
  {
    id: "usedWithIssues",
    name: "Used with Issues",
  },
];

export const swapTypes = [
  {
    id: "free",
    name: "For Free",
  },
  {
    id: "swapWithAny",
    name: "swap with ANY item",
  },
  {
    id: "swapWithAnother",
    name: "Swap with specific category item",
  },
];
export const swapList = [
  {
    id: "free",
    name: "For Free",
  },
  {
    id: "swapWithAny",
    name: "swap with ANY item",
  },
  {
    id: "swapWithAnother",
    name: "Swap with specific category item",
  },
];

export type ImageSource = {
  uri?: string;
  name?: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  isTemplate?: boolean;
  isDefault?: boolean;
  deletable?: boolean;
  downloadURL?: string;
  filePath?: string;
  onError?: (error?: any) => void;
  metadata?: ImageMetadata;
};
export interface Item extends DataSearchable, Entity {
  id: string;
  objectID?: string; // for Algolia
  userId: string; // deprecated
  user: PublicUser;
  name: string;
  category: Category;
  catLevel1?: string;
  catLevel2?: string;
  catLevel3?: string;
  condition: {
    name?: string;
    type: ConditionType;
    desc?: string;
  };
  description?: string;
  images?: ImageSource[];
  defaultImageURL?: string;
  location?: Location;
  views?: number;
  timestamp?: Date;
  status: ItemStatus;
  swapOption: {
    type: SwapType;
    category?: Category;
  };
  swapOptionType?: string; // deprecated
  offers?: string[];
  archived?: boolean;
}

export interface ImageMetadata {
  docId: string;
}

class ItemsApi extends DatabaseApi<Item> {
  constructor() {
    super("items");
  }

  uploadBatch = async (itemId: string, images: ImageSource[]) => {
    this.logger.debug("uploadBatch", images);
    const promises: any[] = [];
    images.forEach(async (image) => {
      const promise = this.upload(itemId, image);
      promises.push(promise);
    });
    await Promise.all(promises);
  };

  deleteImage = async (uid: string, image: ImageSource, item?: Item) => {
    const reference = storage().ref(
      `${constants.firebase.ITEM_UPLOAD_PATH}/${uid}/${image.name}`
    );
    try {
      await reference.delete();
      if (item) {
        const updatedImages = item.images?.filter(
          (i) => i.downloadURL !== image.downloadURL
        );
        if (updatedImages) {
          const defaultImageURL =
            item.defaultImageURL === image.downloadURL
              ? updatedImages[0].downloadURL
              : item.defaultImageURL;
          this.update(item.id, {
            images: updatedImages,
            defaultImageURL,
          });
        }
      }
    } catch (error) {
      super.logEvent({} as AnalyticsEvent, "delete", error as Error);
      crashlytics().recordError(error as Error);
      throw error;
    }
  };

  upload = (uid: string, image: ImageSource) => {
    const path = `${constants.firebase.ITEM_UPLOAD_PATH}/${uid}/${image.name}`;
    const reference = storage().ref(path);
    const pathToFile = image.uri!;
    // uploads file
    const task = reference.putFile(pathToFile);
    return task;
  };

  delete = async (item: Item) => {
    await super.deleteById(item.id);
    try {
      item.images?.forEach(async (image) => {
        await this.deleteImage(item.userId, image);
      });
    } catch (error) {
      console.warn(error);
      throw error;
    }
  };

  readonly MY_ITEMS_CACHE_KEY = "my_items";

  getImageUrl(item: Item) {
    return item?.defaultImageURL ?? constants.firebase.TEMP_IMAGE_URL;
  }

  getShareLink(item: Item) {
    return this.getShareLinkById(item.id);
  }

  getShareLinkById(itemId: string) {
    return `https://mataapp.page.link/?link=https%3A%2F%2Fmataup.com/items%3Fid%3D${itemId}&apn=com.mata.mataapp`;
  }

  getInvalidContent(...args: (string | undefined)[]) {
    if (args && args.length > 0) {
      const content: string[] = [];
      args.forEach((arg) => {
        const invalidContentItem = invalidContent.find(
          (i) => arg?.trim() === i || arg?.includes(` ${i} `)
        );
        if (arg && invalidContentItem) {
          content.push(invalidContentItem);
        }
      });
      return content.length > 0 ? content : undefined;
    }
    return undefined;
  }

  blockItem(item: Item) {
    const prom = functions.httpsCallable("blockItem")({ itemId: item.id });
    Analytics.logEvent("block_item");
    return prom;
  }

  async archiveItem(item: Item) {
    try {
      const prom = await functions.httpsCallable("archiveItem")({
        itemId: item.id,
      });
      Analytics.logEvent("archive_no_swap");
      return prom;
    } catch (error) {
      Analytics.logError("archive_no_swap", error as Error);
      throw error;
    }
  }
  async renewItem(item: Item) {
    try {
      const prom = await functions.httpsCallable("renewItem")({
        itemId: item.id,
      });
      Analytics.logEvent("refresh_item");
      return prom;
    } catch (error) {
      Analytics.logError("refresh_item", error as Error);
      throw error;
    }
  }

  async deleteItem(item: Item) {
    try {
      const prom = await functions.httpsCallable("deleteItem")({
        itemId: item.id,
      });
      Analytics.logEvent("Delete_swap_out");
      return prom;
    } catch (error) {
      Analytics.logError("Delete_swap_out", error as Error);
      throw error;
    }
  }
}

const itemsApi = new ItemsApi();

export default itemsApi;
