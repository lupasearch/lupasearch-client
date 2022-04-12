<template>
  <div class="lupa-search-box-image-wrapper">
    <img
      class="lupa-search-box-image"
      :src="hasImage ? imageUrl : placeholder"
      @error="replaceWithPlaceholder"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { ImageDocumentElement } from "@/types/DocumentElement";

@Component
export default class SearchBoxProductImage extends Vue {
  @Prop() item!: Document;
  @Prop() options!: ImageDocumentElement;

  get hasFullImageUrl(): boolean {
    const imageUrl = this.image;
    return (
      typeof imageUrl === "string" &&
      (imageUrl.indexOf("http://") === 0 || imageUrl.indexOf("https://") === 0)
    );
  }

  get rootImageUrl(): string | undefined {
    return this.options.baseUrl;
  }

  get image(): string {
    return this.item[this.options.key] as string;
  }

  get imageUrl(): string {
    const imageUrl = this.image;
    if (this.hasFullImageUrl) {
      return imageUrl;
    }
    return `${this.rootImageUrl ?? ""}/${imageUrl}`;
  }

  get hasImage(): boolean {
    return Boolean(this.hasFullImageUrl || this.image);
  }

  get placeholder(): string {
    return this.options.placeholder;
  }

  replaceWithPlaceholder(e: Event): void {
    const targetImage = e?.target as HTMLImageElement;
    if (targetImage && !targetImage?.src?.includes(this.placeholder)) {
      targetImage.src = this.placeholder;
    }
  }
}
</script>
