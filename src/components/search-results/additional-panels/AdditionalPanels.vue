<template>
  <div v-if="isVisible" class="lupa-results-additional-panels">
    <AdditionalPanel
      v-for="panel of locationPanels"
      :key="panel.queryKey"
      :panel="panel"
      :options="sdkOptions"
    >
    </AdditionalPanel>
  </div>
</template>
<script lang="ts">
import { SdkOptions } from "@/types/General";
import { SearchResultsAdditionalPanelOptions } from "@/types/search-results/SearchResultsAdditionalPanelOptions";
import { SearchResultsAdditionalPanels } from "@/types/search-results/SearchResultsOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import AdditionalPanel from "./AdditionalPanel.vue";

@Component({
  name: "additionalPanels",
  components: {
    AdditionalPanel,
  },
})
export default class AdditionalPanels extends Vue {
  @Prop({ required: true }) options!: SearchResultsAdditionalPanels;
  @Prop({ required: true }) sdkOptions!: SdkOptions;
  @Prop({ required: true }) location!: "top" | "bottom";

  get locationPanels(): SearchResultsAdditionalPanelOptions[] {
    return (
      this.options.additionalPanels?.filter(
        (p) => p.location === this.location
      ) ?? []
    );
  }

  get isVisible(): boolean {
    return this.locationPanels.length > 0;
  }
}
</script>
