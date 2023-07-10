<script setup lang="ts">
import { computed } from 'vue'
import { RECOMMENDATIONS_OPTIONS } from './constants/development/recommendationsDev.const'
import { ProductRecommendationOptions, Recommendations } from '@getlupa/vue'
import '@getlupa/vue/dist/style.css'

const recommendationsOptions = computed((): ProductRecommendationOptions => {
  return RECOMMENDATIONS_OPTIONS
})
</script>

<template>
  <div id="app" class="wrapper">
    <!-- Following icon fonts are available during the plugin development only -->
    <!-- Include your own fonts and icons with your custom theme when deploying your plugin -->
    <link
      href="//db.onlinewebfonts.com/c/68590d1f06ad625cb73b5c34f85b4a1b?family=Luma-Icons"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css"
      rel="stylesheet"
    />
    <div class="recommendations-wrapper">
      <Recommendations :options="recommendationsOptions" />
    </div>
  </div>
</template>
<style lang="scss">
#app {
  height: auto;
  display: flex;
  flex-direction: column;
}

.wrapper {
  margin: 10px;
}

.box-wrapper {
  width: 50%;
  margin: 20px auto;
  @media (max-width: 752px) {
    width: 95%;
    margin: 10px auto;
  }
}

.result-wrapper,
.list-wrapper {
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  // max-width: 1050px;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
}

.recommendations-wrapper {
  display: flex;
}
</style>
