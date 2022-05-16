<template>
  <div class="lupa-search-result-facet-stats-values">
    <div class="lupa-stats-facet-summary" v-if="!isInputVisible">
      {{ statsSummary }}
    </div>
    <div class="lupa-stats-facet-summary-input" v-else>
      <div>
        <div class="lupa-stats-range-label" v-if="rangeLabelFrom">
          {{ rangeLabelFrom }}
        </div>
        <div class="lupa-stats-from">
          <input
            v-model.lazy="fromValue"
            type="number"
            :max="facetMax"
            :min="facetMin"
            :step="isPrice ? '0.01' : '1'"
          />
          <span v-if="isPrice">{{ currency }}</span>
        </div>
      </div>
      <div class="lupa-stats-separator"></div>
      <div>
        <div class="lupa-stats-range-label" v-if="rangeLabelTo">
          {{ rangeLabelTo }}
        </div>
        <div class="lupa-stats-to">
          <input
            v-model.lazy="toValue"
            type="number"
            :max="facetMax"
            :min="facetMin"
            :step="isPrice ? '0.01' : '1'"
          />
          <span v-if="isPrice">{{ currency }}</span>
        </div>
      </div>
    </div>
    <div class="lupa-stats-slider-wrapper" v-if="isSliderVisible">
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
import {
  ResultFacetOptions,
  SearchResultsOptions,
} from "@/types/search-results/SearchResultsOptions";
import { formatPriceSummary } from "@/utils/price.utils";
import VueSlider from "vue-slider-component";
import { CURRENCY_KEY_INDICATOR } from "@/constants/global.const";
import { formatRange } from "@/utils/filter.utils";
import { namespace } from "vuex-class";

const options = namespace("options");

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

  @options.State((s) => s.searchResultOptions)
  searchResultOptions!: SearchResultsOptions;

  get rangeLabelFrom(): string {
    return this.options.stats?.labels?.from ?? "";
  }

  get rangeLabelTo(): string {
    return this.options.stats?.labels?.to ?? "";
  }

  get currency(): string {
    return this.searchResultOptions?.labels.currency;
  }

  get isSliderVisible(): boolean {
    return Boolean(this.options.stats?.slider ?? true);
  }

  get isInputVisible(): boolean {
    return Boolean(this.options.stats?.inputs);
  }

  get fromValue(): string {
    return this.isPrice
      ? this.sliderRange[0].toFixed(2)
      : `${this.sliderRange[0]}`;
  }

  set fromValue(stringValue: string) {
    let value = +stringValue;
    if (value < this.facetMin) {
      value = this.facetMin;
    }
    if (!value || value < this.facetMin || value > this.facetMax) {
      return;
    }
    this.innerSliderRange = [value, this.sliderRange[1]];
    this.handleInputChange();
  }

  get toValue(): string {
    return this.isPrice
      ? this.sliderRange[1].toFixed(2)
      : `${this.sliderRange[1]}`;
  }

  set toValue(stringValue: string) {
    let value = +stringValue;
    if (value > this.facetMax) {
      value = this.facetMax;
    }
    if (!value || value < this.facetMin) {
      return;
    }
    this.innerSliderRange = [this.sliderRange[0], value];
    this.handleInputChange();
  }

  get currentGte(): number | undefined {
    return typeof this.currentFilters.gte === "string"
      ? parseFloat(this.currentFilters.gte)
      : this.currentFilters.gte;
  }

  get currentLte(): number | undefined {
    return typeof this.currentFilters.lt === "string"
      ? parseFloat(this.currentFilters.lt)
      : this.currentFilters.lt;
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
      ? formatPriceSummary(
          [min, max],
          this.currency,
          this.searchResultOptions.labels.priceSeparator
        )
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

  handleInputChange(): void {
    if (this.innerSliderRange.length < 1) {
      return;
    }
    this.handleChange();
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
