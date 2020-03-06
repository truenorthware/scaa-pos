<template>
  <v-layout column class="pa-0 ma-0">
    <v-flex xs3 class="pa-0 ma-0 grey darken-2">
      <numeric-button :class="classKeyPad" value="1" @click="onButtonClick($event, 1)" />
      <numeric-button :class="classKeyPad" value="2" @click="onButtonClick($event, 2)" />
      <numeric-button :class="classKeyPad" value="3" @click="onButtonClick($event, 3)" />
    </v-flex>
    <v-flex xs3 class="pa-0 ma-0 grey darken-2">
      <numeric-button :class="classKeyPad" value="4" @click="onButtonClick($event, 4)" />
      <numeric-button :class="classKeyPad" value="5" @click="onButtonClick($event, 5)" />
      <numeric-button :class="classKeyPad" value="6" @click="onButtonClick($event, 6)" />
    </v-flex>
    <v-flex xs3 class="pa-0 ma-0 grey darken-2">
      <numeric-button :class="classKeyPad" value="7" @click="onButtonClick($event, 7)" />
      <numeric-button :class="classKeyPad" value="8" @click="onButtonClick($event, 8)" />
      <numeric-button :class="classKeyPad" value="9" @click="onButtonClick($event, 9)" />
    </v-flex>
    <v-flex xs3 class="pa-0 ma-0 grey darken-2">
      <numeric-button class="numeric-btn" value="." @click="onButtonClick($event, 0.1)" />
      <numeric-button class="numeric-btn" value="0" @click="onButtonClick($event, 0)" />
      <numeric-button class="numeric-btn" :value="c_value" @click="onButtonClick($event, -1)" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { ButtonEvent } from "@/types";

@Component({
  components: {
    NumericButton: () => import("@/components/button/numeric-button.vue")
  }
})
export default class DrawerNumericButtons extends Vue {
  private classKeyPad = "numeric-btn border-bottom";
  @Prop({ default: "+/-" }) c_value?: String;

  onButtonClick(e, val) {
    this.onClick(e, val);
  }

  @Emit("click")
  onClick(e, val) {
    if (this.c_value == "C") return val;
    else return;
  }
}
</script>

<style scoped>
.numeric-btn {
  border: 1px solid #f0eef0 !important;
  border-left: none !important;
  min-width: 63px !important;
}
.border-bottom {
  border-bottom: none !important;
}
.toggle {
  display: grid;
  margin-left: -2px;
}
.theme--light.v-btn-toggle .v-btn.v-btn {
  border-color: #f0eef0 !important;
  border-left: none !important;
}
</style>
