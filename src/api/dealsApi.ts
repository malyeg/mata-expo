import { functions } from "../firebase";
import {
  DataSearchable,
  Entity,
  Operation,
  QueryBuilder,
} from "../types/DataTypes";
import Analytics from "../utils/Analytics";
import { APIOptions } from "./Api";
import { PublicUser } from "./authApi";
import { DatabaseApi } from "./DatabaseApi";
import { Item } from "./itemsApi";
import { RatingWeight } from "./ratingApi";
export type DealStatus =
  | "new"
  | "accepted"
  | "canceled"
  | "rejected"
  | "closed";

export interface DealRating {
  rate: RatingWeight;
  comments?: string;
}
export interface Deal extends DataSearchable, Entity {
  id: string;
  userId: string; //deprecated
  user: PublicUser;
  item: Item;
  swapItem?: Item;
  status: DealStatus;
  statusChanges?: { status: DealStatus; userId: string }[];
  rating?: {
    [key: string]: DealRating; // key represents the target userId
  };
  archived?: boolean;
  closeDate?: Date;
  newMessages?: {
    [key: string]: string[];
  };
}
class DealsApi extends DatabaseApi<Deal> {
  getOffers(itemId: string) {
    const query = QueryBuilder.from({
      filters: [
        { field: "item.id", value: itemId },
        {
          field: "status",
          operation: Operation.IN,
          value: ["new", "accepted"] as DealStatus[],
        },
      ],
    });
    return this.getAll(query);
  }
  async updateDealMessagesRecieved(dealId: string, messages: string[]) {
    const prom = await functions.httpsCallable("updateDealMessagesRecieved")({
      dealId,
      messages,
    });
    Analytics.logEvent("update_deal_messages");
    return prom;
  }
  constructor() {
    super("deals");
  }

  getById = async (id: string, options?: APIOptions) => {
    const deal = await super.getById(id, options);
    const closeTimestamp = (deal as any).closeTimestamp;
    if (deal && closeTimestamp) {
      // const timestamp = (snapshot.data()?.timestamp as any)?.toDate();
      deal.closeDate = closeTimestamp.toDate();
    }
    return deal;
  };

  createOffer = async (user: Deal["user"], item: Item, swapItem?: Item) => {
    const deal: Omit<Deal, "id"> = {
      item,
      userId: user.id!,
      user,
      status: "new",
    };
    if (swapItem) {
      deal.swapItem = swapItem;
    }
    const options: APIOptions = {
      analyticsEvent: {
        name: "create_deal",
        params: {
          category: item.category.name,
        },
      },
    };
    return await this.create(deal);
  };

  getUserDeals = async (userId: string, item: Item) => {
    const query = new QueryBuilder<Deal>()
      .filters([
        { field: "userId", value: userId },
        { field: "item.id", value: item.id },
        {
          field: "status",
          operation: Operation.IN,
          value: ["accepted", "new"] as DealStatus[],
        },
      ])
      .build();
    return await this.getAll(query);
  };

  itemHasDeals = async (userId: string, item: Item) => {
    const deals = await this.getUserDeals(userId, item);
    if (deals && deals.length > 0) {
      return true;
    }
    return false;
  };

  // TODO replace with FB function
  updateStatus = (deal: Deal, userId: string, status: DealStatus) => {
    const statusChange = { status, userId };
    const statusChanges = deal.statusChanges
      ? [...deal.statusChanges, statusChange]
      : [statusChange];
    return this.update(
      deal.id,
      {
        status,
        statusChanges,
      },
      { cache: { evict: deal.id } }
    );
  };

  acceptOffer = async (dealId: string, rejectOtherOffers: boolean) => {
    const prom = await functions.httpsCallable("acceptOffer")({
      dealId,
      rejectOtherOffers,
    });
    Analytics.logEvent("accept_deal");
    return prom;
  };

  rejectOffer = async (deal: Deal, reason: string) => {
    const prom = await functions.httpsCallable("rejectOffer")({
      dealId: deal.id,
      reason,
    });
    Analytics.logEvent("reject_deal", {
      category: deal.item.category.name,
    });
    return prom;
  };

  cancelOffer = async (deal: Deal, reason: string = "other") => {
    const prom = await functions.httpsCallable("cancelOffer")({
      dealId: deal.id,
      reason,
    });
    Analytics.logEvent("cancel_deal", {
      category: deal.item.category.name,
    });
    return prom;
  };
  closeOffer = async (deal: Deal) => {
    // return this.closeOffer
    const result = await functions.httpsCallable("closeOffer")({
      dealId: deal.id,
    });
    Analytics.logEvent("close_deal", {
      category: deal.item.category.name,
    });
    await itemsSearchApi.clearCache();
    return result;
  };

  rateDeal = (deal: Deal, targetUserId: string, dealRating: DealRating) => {
    const prom = functions.httpsCallable("rateDeal")({
      dealId: deal.id,
      targetUserId,
      dealRating,
    });
    Analytics.logEvent("rate_deal", {
      category: deal.item.category.name,
      rate: dealRating.rate,
    });
    return prom;
  };

  readonly DEALS_CACHE_KEY = "deals";
}

const dealsApi = new DealsApi();

export default dealsApi;
