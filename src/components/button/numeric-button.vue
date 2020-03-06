<template>
  <v-btn
    text
    tile
    class="title white grey--text"
    outlined
    height="60"
    width="60"
    style="border-radius: 0;"
    @click="handleClick"
    >{{ value }}</v-btn
  >
  <!-- style="border-radius: 0; height: 60px;" -->
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component({})
export default class NumericButton extends Vue {
  private name = "numeric-button";

  @Prop({ default: "0" }) value?: String;

  handleClick = e => {
    this.onClick(e);
  };

  @Emit("click")
  onClick(e) {
    return e;
  }
}
</script>
