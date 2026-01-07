import { deleteObject, putFile, ref } from "@react-native-firebase/storage";
import constants from "../config/constants";
import invalidContent from "../data/invalidContent";
import { callFunction, crashlytics, storage } from "../firebase";
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
export type SwapOptionType = "free" | "swapWithAnother" | "swapWithAny";

interface StatusOption {
  id: ItemStatus;
  name: string;
  localizedName: { [key: string]: string };
}

export const statusList: StatusOption[] = [
  {
    id: "online",
    name: "Online",
    localizedName: {
      en: "Online",
      ar: "متاح",
    },
  },
  {
    id: "blocked",
    name: "Blocked",
    localizedName: {
      en: "Blocked",
      ar: "محظور",
    },
  },
  {
    id: "pending",
    name: "Pending",
    localizedName: {
      en: "Pending",
      ar: "قيد الانتظار",
    },
  },
  {
    id: "draft",
    name: "Draft",
    localizedName: {
      en: "Draft",
      ar: "مسودة",
    },
  },
  {
    id: "archived",
    name: "Archived",
    localizedName: {
      en: "Archived",
      ar: "مؤرشف",
    },
  },
];

interface ItemCondition {
  id: ConditionType;
  name: string;
  localizedName: { [key: string]: string };
}

export const conditionList: ItemCondition[] = [
  {
    id: "new",
    name: "New",
    localizedName: {
      en: "New",
      ar: "جديد",
    },
  },
  {
    id: "goodAsNew",
    name: "Good As New",
    localizedName: {
      en: "Good As New",
      ar: "جيد كما جديد",
    },
  },
  {
    id: "used",
    name: "Used",
    localizedName: {
      en: "Used",
      ar: "مستعمل",
    },
  },
  {
    id: "usedWithIssues",
    name: "Used with Issues",
    localizedName: {
      en: "Used with Issues",
      ar: "مستعمل مع مشاكل",
    },
  },
];

export const swapTypes = [
  {
    id: "free",
    name: "For Free",
    localizedName: {
      en: "For Free",
      ar: "مجاني",
    },
  },
  {
    id: "swapWithAny",
    name: "swap with ANY item",
    localizedName: {
      en: "swap with ANY item",
      ar: "مبادلة مع أي عنصر",
    },
  },
  {
    id: "swapWithAnother",
    name: "Swap with specific category item",
    localizedName: {
      en: "Swap with specific category item",
      ar: "مبادلة مع عنصر من نفس الفئة",
    },
  },
];
interface SwapOption {
  id: SwapOptionType;
  name: string;
  localizedName: { [key: string]: string };
}

export const swapList: SwapOption[] = [
  {
    id: "free",
    name: "For Free",
    localizedName: {
      en: "For Free",
      ar: "مجانا",
    },
  },
  {
    id: "swapWithAny",
    name: "swap with ANY item",
    localizedName: {
      en: "swap with ANY item",
      ar: "مبادلة مع أي عنصر",
    },
  },
  {
    id: "swapWithAnother",
    name: "Swap with specific category item",
    localizedName: {
      en: "Swap with specific category item",
      ar: "مبادلة مع عنصر من نفس الفئة",
    },
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
    type: SwapOptionType;
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
    const reference = ref(
      storage,
      `${constants.firebase.ITEM_UPLOAD_PATH}/${uid}/${image.name}`
    );
    try {
      await deleteObject(reference);
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
      crashlytics.recordError(error as Error);
      throw error;
    }
  };

  upload = (uid: string, image: ImageSource) => {
    const path = `${constants.firebase.ITEM_UPLOAD_PATH}/${uid}/${image.name}`;
    const reference = ref(storage, path);
    const pathToFile = image.uri!;
    // uploads file
    const task = putFile(reference, pathToFile);
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
    return `https://${constants.BASE_URL}/items/${itemId}`;
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

  blockItem(itemId: string) {
    const prom = callFunction("blockItem")({ itemId });
    Analytics.logEvent("block_item");
    return prom;
  }

  unblockItem(itemId: string) {
    const prom = callFunction("unblockItem")({ itemId });
    Analytics.logEvent("unblock_item");
    return prom;
  }

  async archiveItem(item: Item) {
    try {
      const prom = await callFunction("archiveItem")({
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
      const prom = await callFunction("renewItem")({
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
      const prom = await callFunction("deleteItem")({
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
