<script lang="ts" setup>
import { cloneDeep, merge } from 'lodash'
import { DEFAULT_SEARCH_BOX_OPTIONS } from '../constants/searchBox.const'
import { computed, ref, type Ref } from 'vue'
import { type SearchBoxOptions, SearchBox } from '@getlupa/vue'

const props = defineProps<{
  searchBoxOptions: SearchBoxOptions
}>()

const searchBox: Ref<null | any> = ref(null)

const fullSearchBoxOptions = computed((): SearchBoxOptions => {
  const options = cloneDeep(props.searchBoxOptions)
  return merge(cloneDeep(DEFAULT_SEARCH_BOX_OPTIONS), options)
})

const fetch = (): void => {
  searchBox.value?.handleCurrentValueSearch()
}

defineExpose({ fetch })
</script>

<template>
  <SearchBox :options="fullSearchBoxOptions" ref="searchBox" />
</template>
