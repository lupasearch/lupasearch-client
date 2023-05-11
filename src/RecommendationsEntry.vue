<template>
  <Recommendations
    :options="recommendationOptions"
    ref="productRecommendations"
  />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Recommendations from "./components/recommendations/Recommendations.vue";
import { ProductRecommendationOptions } from "./types/recommendations/RecommendationsOptions";

@Component({
  name: "recommendationsEntry",
  components: {
    Recommendations,
  },
})
export default class RecommendationsEntry extends Vue {
  @Prop() recommendationOptions!: ProductRecommendationOptions;

  fetch(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.productRecommendations as any)?.fetch();
  }
}
</script>
