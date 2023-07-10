<script lang="ts" setup>
import { cloneDeep, merge } from 'lodash'
import { type Ref, ref, computed } from 'vue'
import { DEFAULT_OPTIONS_RESULTS } from '../constants/searchResults.const'

import { type SearchResultsOptions, SearchResults } from '@getlupa/vue'

const props = defineProps<{
  searchResultsOptions: SearchResultsOptions
}>()

const searchResults: Ref<null | any> = ref(null)

const fullSearchResultsOptions = computed((): SearchResultsOptions => {
  const options = cloneDeep(props.searchResultsOptions)
  return merge(DEFAULT_OPTIONS_RESULTS, options)
})

const fetch = (): void => {
  searchResults.value?.handleUrlChange()
}

defineExpose({ fetch })
</script>

<template>
  <SearchResults :options="fullSearchResultsOptions" ref="searchResults" />
</template>
