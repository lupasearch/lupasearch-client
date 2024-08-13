import { ProductRecommendationOptions } from '@getlupa/vue'
import { SEARCH_RESULTS_CONFIGURATION } from './searchResultsDev.const'

export const RECOMMENDATIONS_OPTIONS: ProductRecommendationOptions = {
  ...SEARCH_RESULTS_CONFIGURATION,
  containerSelector: '',
  queryKey: '	r-h5oxch3bw2hq',
  itemId: ['2', '3'],
  abTesting: {
    enabled: false
  },
  carousel: {
    scrollPerPage: 4,
    itemsToShow: 3,
    breakpoints: {
      768: {
        itemsToShow: 4
      },
      1024: {
        itemsToShow: 6
      }
    }
  }
}
