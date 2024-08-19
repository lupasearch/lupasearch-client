import { ProductRecommendationOptions } from '@getlupa/vue'
import { SEARCH_RESULTS_CONFIGURATION } from './searchResultsDev.const'

export const RECOMMENDATIONS_OPTIONS: ProductRecommendationOptions = {
  ...SEARCH_RESULTS_CONFIGURATION,
  containerSelector: '',
  queryKey: '	r-h5oxch3bw2hq',
  itemId: '1',
  abTesting: {
    enabled: false
  },
  recommendationLabels: {
    title: 'You may also like',
  },
  carousel: {
    scrollPerPage: 4,
    itemsToShow: 5,
    breakpoints: {
      768: {
        itemsToShow: 3
      },
      1024: {
        itemsToShow: 4
      }
    }
  }
}
