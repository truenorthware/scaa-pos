<template>
  <v-btn-toggle class="toggle" v-model="toggle_exclusive" mandatory>
    <v-btn
      text
      :class="
        `subtitle-2 white--text group-btn border-bottom ${
          currentMode === 1 ? 'secondary' : 'grey darken-1'
        }`
      "
      type="radio"
      style="border-radius: 0; height: 60px;"
      @click="onButtonClick($event, 10001)"
      >Qty</v-btn
    >
    <v-btn
      text
      :class="
        `subtitle-2 white--text group-btn border-bottom ${
          currentMode === 2 ? 'secondary' : 'grey darken-1'
        }`
      "
      style="border-radius: 0; height: 60px;"
      @click="onButtonClick($event, 10002)"
      >Disc</v-btn
    >
    <v-btn
      text
      :class="
        `subtitle-2 white--text group-btn border-bottom ${
          currentMode === 3 ? 'secondary' : 'grey darken-1'
        }`
      "
      style="border-radius: 0; height: 60px;"
      @click="onButtonClick($event, 10003)"
      >Price</v-btn
    >
  </v-btn-toggle>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component({})
export default class DrawerFunctionButtons extends Vue {
  private name = "drawer-function-button";

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
