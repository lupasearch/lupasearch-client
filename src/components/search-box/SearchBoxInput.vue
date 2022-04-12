<template>
  <div id="lupa-search-box-input">
    <input
      class="lupa-hint"
      :value="showHint ? suggestedValue.item.suggestion : ''"
      disabled
    />
    <input
      v-model="inputValue"
      v-bind="inputAttributes"
      autocomplete="off"
      class="lupa-search-box-input-field"
      data-cy="lupa-search-box-input-field"
      type="text"
      :placeholder="labels.placeholder"
      @input="handleInput"
      @focus="handleFocus"
    />
  </div>
</template>

<script lang="ts">
import { InputSuggestion } from "@/types/search-box/Common";
import { SearchBoxInputOptions } from "@/types/search-box/SearchBoxOptions";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

const searchBox = namespace("searchBox");
const params = namespace("params");

@Component({
  name: "searchBoxInput",
})
export default class SearchBoxInput extends Vue {
  @Prop() options!: SearchBoxInputOptions;
  @Prop({ default: () => ({ value: "", override: false }) })
  suggestedValue!: InputSuggestion;

  labels = this.options.labels;
  input = "";

  @searchBox.Mutation("saveInputValue") saveInputValue!: ({
    input,
  }: {
    input: string;
  }) => void;

  @params.Getter("query") query!: string;

  get inputValue(): string {
    return this.input;
  }

  set inputValue(value: string) {
    this.saveInputValue({ input: value });
    this.input = value;
  }

  get showHint(): boolean {
    return (
      this.inputValue.length > 0 &&
      this.suggestedValue.item?.suggestion?.startsWith(this.inputValue)
    );
  }

  get inputAttributes(): Record<string, string> {
    return {
      ...(this.options.inputAttributes ?? {}),
    };
  }

  @Watch("suggestedValue")
  onSuggestedValueChange(): void {
    if (this.suggestedValue.override)
      this.input = this.suggestedValue.item.suggestion;
  }

  @Watch("query")
  handleQueryChange(): void {
    this.inputValue = this.query;
  }

  handleInput(evt?: InputEvent): void {
    const target = evt?.target as HTMLInputElement;
    if (target) {
      this.inputValue = target.value;
    }
    this.$emit("input", this.inputValue.replace(/\s+$/, ""));
  }

  handleFocus(): void {
    this.$emit("focus");
    this.handleInput();
  }
}
</script>

<style>
.lupa-search-box-input-field,
.lupa-hint {
  width: 100%;
}
.lupa-search-box-input-field {
  position: relative !important;
  background: transparent !important;
}
.lupa-hint {
  opacity: 0.5;
  position: absolute !important;
  pointer-events: none;
}
</style>
