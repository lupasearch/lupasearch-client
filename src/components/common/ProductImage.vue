<template>
  <div :class="wrapperClass">
    <img :class="imageClass" :src="finalUrl" @error="replaceWithPlaceholder" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Document } from "@getlupa/client-sdk/Types";
import { ImageDocumentElement } from "@/types/DocumentElement";

@Component
export default class ProductImage extends Vue {
  @Prop() item!: Document;
  @Prop() options!: ImageDocumentElement;

  @Prop({ default: "" }) wrapperClass!: string;
  @Prop({ default: "" }) imageClass!: string;

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

  get finalUrl(): string {
    if (this.options.customUrl) {
      return this.options.customUrl(this.item);
    }
    return this.hasImage ? this.imageUrl : this.placeholder;
  }

  replaceWithPlaceholder(e: Event): void {
    const targetImage = e?.target as HTMLImageElement;
    if (targetImage && !targetImage?.src?.includes(this.placeholder)) {
      targetImage.src = this.placeholder;
    }
  }
}
</script>
