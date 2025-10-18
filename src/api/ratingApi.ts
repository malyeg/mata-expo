export type RatingWeight = 1 | 2 | 3 | 4 | 5;

export interface StarItem {
  index: number;
  selected: boolean;
}

export interface RatingItem {
  weight: RatingWeight;
  count: number;
}
class RatingApi {
  calc(ratings: RatingItem[]) {
    let totalWeight = 0;
    let totalReviews = 0;

    ratings.forEach(rating => {
      const weightMultipliedByNumber = rating.weight * rating.count;
      totalWeight += weightMultipliedByNumber;
      totalReviews += rating.count;
    });

    if (totalReviews > 0) {
      const averageRating = totalWeight / totalReviews;
      return averageRating;
    }
  }
}

const ratingApi = new RatingApi();
export default ratingApi;
