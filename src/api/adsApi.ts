import { Entity } from "../types/DataTypes";
import { DatabaseApi } from "./DatabaseApi";

export interface Ad extends Entity {
  id: string;
  name: string;
  weight: number;
  image?: {
    url: string;
  };
  url: string;
  type?: "admob" | "campain";
}

class AdsApi extends DatabaseApi<Ad> {
  constructor() {
    super("ads");
  }

  async getRandomOne() {
    const ads = await this.getAll();
    const randomAd = this.weightedRandom(ads!);
    return randomAd;
  }

  weightedRandom(ads: Ad[]) {
    const weights = ads.map((a) => a.weight);
    if (ads.length !== weights.length) {
      throw new Error("Items and weights must be of the same size");
    }

    if (!ads.length) {
      throw new Error("Items must not be empty");
    }

    // Preparing the cumulative weights array.
    // For example:
    // - weights = [1, 4, 3]
    // - cumulativeWeights = [1, 5, 8]
    const cumulativeWeights: number[] = [];
    for (let i = 0; i < weights.length; i += 1) {
      cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    }
    // Getting the random number in a range of [0...sum(weights)]
    // For example:
    // - weights = [1, 4, 3]
    // - maxCumulativeWeight = 8
    // - range for the random number is [0...8]
    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
    const randomNumber = maxCumulativeWeight * Math.random();

    // Picking the random item based on its weight.
    // The items with higher weight will be picked more often.
    for (let itemIndex = 0; itemIndex < ads.length; itemIndex += 1) {
      if (cumulativeWeights[itemIndex] >= randomNumber) {
        return {
          item: ads[itemIndex],
          index: itemIndex,
        };
      }
    }
  }
}

const adsApi = new AdsApi();

export default adsApi;
