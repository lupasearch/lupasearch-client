import { ProductRecommendationOptions } from "@/types/recommendations/RecommendationsOptions";
import { SEARCH_RESULTS_CONFIGURATION } from "./searchResultsDev.const";

export const RECOMMENDATIONS_OPTIONS: ProductRecommendationOptions = {
  ...SEARCH_RESULTS_CONFIGURATION,
  containerSelector: "",
  queryKey: "lohywq8d066a",
  itemId: "1",
  abTesting: {
    enabled: false,
  },
  carousel: {
    pageSizes: [
      // browser width x, item count per carousel page
      [768, 3],
      [1024, 4],
    ],
  },
};
