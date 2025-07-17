import { Document, Page, Query } from "../types/DataTypes";
import Analytics, { AnalyticsEvent } from "../utils/Analytics";
import { CacheConfig } from "../utils/cache/cacheManager";
import { LoggerFactory } from "../utils/logger";

// TODO transform firebase errors

export interface ApiResponse<T = any> {
  items: T[];
  docs?: Document[];
  query?: Query;
  lastDoc?: Document;
  page?: Page;
}
export interface APIOptions {
  analyticsEvent?: AnalyticsEvent;
  cache?: CacheConfig;
  searchable?: { keywords: string[]; type?: "word" | "char" };
}
export class Api {
  logger = LoggerFactory.getLogger(this.constructor.name);
  constructor() {}

  // DEPRECATED
  callAnalytics(
    event: AnalyticsEvent,
    type: "success" | "error" = "success",
    error?: Error
  ) {
    let params = { ...event?.params };
    if (error) {
      params.code = (error as any)?.code ?? error.message;
    }
    return Analytics.logEvent(event.name + "_" + type, params);
  }
}
