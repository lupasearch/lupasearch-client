<script lang="ts" setup>
import { ref } from 'vue'
import { type ProductRecommendationOptions, Recommendations } from '@getlupa/vue'

defineProps<{ recommendationOptions: ProductRecommendationOptions }>()

const productRecommendations = ref(null)

const fetch = (): void => {
  ;(productRecommendations?.value)?.fetch()
}

defineExpose({ fetch })
</script>

<template>
  <Recommendations ref="productRecommendations" :options="recommendationOptions" />
</template>
