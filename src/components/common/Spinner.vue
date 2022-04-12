<template>
  <div class="lupa-spinner-wrapper">
    <div class="lupa-spinner">
      <div v-for="x in 12" :key="x" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default class Spinner extends Vue {}
</script>
<style lang="scss">
@import "./styles/_spinner.scss";

.lupa-spinner-wrapper {
  width: 100%;
}
</style>
