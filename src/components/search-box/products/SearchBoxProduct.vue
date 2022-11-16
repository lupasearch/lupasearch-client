<template>
  <a
    class="lupa-search-box-product"
    :class="{ 'lupa-search-box-product-highlighted': highlighted }"
    data-cy="lupa-search-box-product"
    :href="link"
    @click="handleClick"
  >
    <div class="lupa-search-box-product-image-section">
      <SearchBoxProductElement
        class="lupa-search-box-product-element"
        v-for="element in imageElements"
        :item="item"
        :element="element"
        :key="element.key"
        :labels="labels"
        :link="link"
      />
    </div>

    <div class="lupa-search-box-product-details-section">
      <SearchBoxProductElement
        class="lupa-search-box-product-element"
        v-for="element in detailElements"
        :item="item"
        :element="element"
        :key="element.key"
        :labels="labels"
        :link="link"
      />
    </div>
  </a>
</template>
<script lang="ts">
import Vue from "vue";
import { namespace } from "vuex-class";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { DocumentSearchBoxPanel } from "@/types/search-box/SearchBoxPanel";
import SearchBoxProductElement from "./elements/SearchBoxProductElement.vue";
import { SearchBoxOptionLabels } from "@/types/search-box/SearchBoxOptions";
import { generateLink } from "@/utils/link.utils";
import { DocumentElement, DocumentElementType } from "@/types/DocumentElement";
import { TrackableEventData } from "@/types/search-box/Common";
import { handleRoutingEvent } from "@/utils/routing.utils";
import { RoutingBehavior } from "@/types/search-results/RoutingBehavior";

const history = namespace("history");
const tracking = namespace("tracking");
const options = namespace("options");

@Component({
  components: {
    SearchBoxProductElement,
  },
})
export default class SearchBoxProduct extends Vue {
  @Prop() item!: Document;
  @Prop({ default: "" }) inputValue!: string;
  @Prop() panelOptions!: DocumentSearchBoxPanel;
  @Prop() labels?: SearchBoxOptionLabels;
  @Prop({ default: false }) highlighted?: boolean;

  @options.Getter("boxRoutingBehavior") boxRoutingBehavior!: RoutingBehavior;

  @tracking.Action("track") trackClick!: ({
    queryKey,
    data,
  }: {
    queryKey: string;
    data: TrackableEventData;
  }) => void;

  @history.Action("add") addHistory!: ({ item }: { item: string }) => string[];

  get link(): string {
    return generateLink(this.panelOptions.links?.details ?? "", this.item);
  }

  get imageElements(): DocumentElement[] {
    return (
      this.panelOptions.elements?.filter(
        (e) => e.type === DocumentElementType.IMAGE
      ) ?? []
    );
  }

  get detailElements(): DocumentElement[] {
    return (
      this.panelOptions.elements?.filter(
        (e) => e.type !== DocumentElementType.IMAGE
      ) ?? []
    );
  }

  get id(): string {
    if (this.panelOptions.idKey) {
      return this.item[this.panelOptions.idKey] as string;
    }
    return "";
  }

  get title(): string {
    if (this.panelOptions.titleKey) {
      this.addHistory({
        item: (this.item[this.panelOptions.titleKey] as string) || "",
      });
    }
    return "";
  }

  handleClick(event?: Event): void {
    if (this.panelOptions.titleKey) {
      this.addHistory({
        item: (this.item[this.panelOptions.titleKey] as string) || "",
      });
    }
    if (!this.panelOptions.idKey) {
      return;
    }
    this.trackClick({
      queryKey: this.panelOptions.queryKey,
      data: {
        itemId: this.id,
        searchQuery: this.inputValue,
        type: "itemClick",
        analytics: {
          type: "autocomplete_product_click",
          label: this.title ?? this.link,
        },
      },
    });
    if (!this.link) {
      return;
    }
    this.$emit("product-click");
    handleRoutingEvent(this.link, event, this.boxRoutingBehavior === "event");
  }
}
</script>
