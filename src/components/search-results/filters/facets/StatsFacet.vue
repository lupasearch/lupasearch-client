<template>
  <div class="lupa-search-result-facet-stats-values">
    <div class="lupa-stats-facet-summary">{{ statsSummary }}</div>
    <div class="lupa-stats-slider-wrapper">
      <vue-slider
        class="slider"
        tooltip="none"
        :min="facetMin"
        :max="facetMax"
        :lazy="true"
        :silent="true"
        :duration="0.1"
        v-model="sliderRange"
        @change="handleChange"
        @drag-end="handleChange"
        @dragging="handleDragging"
      >
      </vue-slider>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import {
  FacetGroupTypeStats,
  FilterGroupItemTypeRange,
} from "@getlupa/client-sdk/Types";
import { ResultFacetOptions } from "@/types/search-results/SearchResultsOptions";
import { formatPriceSummary } from "@/utils/price.utils";
import VueSlider from "vue-slider-component";
import { CURRENCY_KEY_INDICATOR } from "@/constants/global.const";
import { formatRange } from "@/utils/filter.utils";

@Component({
  name: "statsFacet",
  components: {
    VueSlider,
  },
})
export default class TermFacet extends Vue {
  @Prop() options!: ResultFacetOptions;
  @Prop({ default: () => ({}) }) facet!: FacetGroupTypeStats;
  @Prop({ default: () => ({}) }) currentFilters!: FilterGroupItemTypeRange;

  innerSliderRange: number[] = [];

  get currentGte(): number | undefined {
    return typeof this.currentFilters.gte === "string"
      ? parseFloat(this.currentFilters.gte)
      : this.currentFilters.gte;
  }

  get currentLte(): number | undefined {
    return typeof this.currentFilters.lte === "string"
      ? parseFloat(this.currentFilters.lte)
      : this.currentFilters.lte;
  }

  get currentMinValue(): number {
    return this.currentGte
      ? Math.max(this.currentGte, this.facetMin)
      : this.facetMin;
  }

  get currentMaxValue(): number {
    return this.currentLte
      ? Math.min(this.currentLte, this.facetMax)
      : this.facetMax;
  }

  get sliderRange(): number[] {
    if (!this.innerSliderRange.length) {
      return [this.currentMinValue, this.currentMaxValue];
    }
    return [
      Math.max(this.innerSliderRange[0], this.facetMin),
      Math.min(this.innerSliderRange[1], this.facetMax),
    ];
  }

  set sliderRange(value: number[]) {
    this.innerSliderRange = value;
  }

  get isPrice(): boolean {
    return this.facet.key?.includes(CURRENCY_KEY_INDICATOR);
  }

  get facetMin(): number {
    return Math.floor(this.facet.min);
  }

  get facetMax(): number {
    return Math.ceil(this.facet.max);
  }

  get statsSummary(): string {
    const [min, max] = this.sliderRange;
    return this.isPrice
      ? formatPriceSummary([min, max])
      : formatRange({ gte: min, lte: max });
  }

  @Watch("currentMinValue")
  onMinValueChange(): void {
    this.innerSliderRange = [];
  }

  @Watch("currentMaxValue")
  onMaxValueChange(): void {
    this.innerSliderRange = [];
  }

  handleChange(): void {
    this.$emit("select", {
      key: this.facet.key,
      value: this.sliderRange,
      type: "range",
    });
  }

  handleDragging(value: number[]): void {
    this.innerSliderRange = value;
  }
}
</script>
