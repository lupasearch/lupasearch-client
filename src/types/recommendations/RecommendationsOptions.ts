import { SdkOptions } from "../General";
import { SearchResultsProductCardOptions } from "../search-results/SearchResultsProductCardOptions";

export type ProductRecommendationOptions = SearchResultsProductCardOptions & {
  options: SdkOptions;
} & {
  containerSelector: string;
  queryKey: string;
  itemId: string;
  abTesting?: RecommendationABTestingOptions;
  carousel?: {
    pageSizes: number[][];
  };
};

export type RecommendationABTestingOptions = {
  enabled: boolean;
  originalIds?: string[];
  events?: {
    lupaSearchEventName: string;
    originalEventName: string;
  };
  oldRecommenderDisplayRatio?: number;
};
