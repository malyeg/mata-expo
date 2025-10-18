import { DataSearchable, Entity } from "@/types/DataTypes";
import { City, Country, State } from "./place.model";
import { RatingItem } from "@/api/ratingApi";

export interface Profile
  extends DataSearchable,
    Omit<Entity, "userId" | "user"> {
  id: string;
  mobile?: string;
  email: string;
  country?: Country;
  state?: State;
  city?: City;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  acceptMarketingFlag?: boolean;
  acceptTermsFlag?: boolean;
  interests?: string[];
  targetCategories?: string[];
  token?: string;
  appRated?: boolean;
  isPublic?: boolean;
  ratings?: RatingItem[];
  image?: {
    url: string;
    width?: number;
    height?: number;
    isSilhouette?: boolean;
  };
  updated?: boolean;
  userId?: string;
}
