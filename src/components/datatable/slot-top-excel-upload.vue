<template>
  <v-toolbar text color="cyan darken-1" elevation="0">
    <v-tabs v-model="tab" @change="onTabChange" :value="tabIndex" background-color="transparent">
      <v-tabs-slider color="black"></v-tabs-slider>

      <v-tab v-for="item in tabItems" :key="item">
        <v-icon>favorite</v-icon>
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-spacer class="hidden-xs-only"></v-spacer>

    <v-btn rounded color="blue-grey" class="ma-2 white--text" @click="onUpload">
      <span class="mr-2"> Upload </span>
      <v-icon color="white" class="mr-2">cloud_upload</v-icon>
    </v-btn>
    <v-btn text icon @click="onPrint"> <v-icon>print</v-icon> </v-btn>
    <v-btn text icon @click="onCancel"> <v-icon>cancel</v-icon> </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class SlotTopExcelUpload extends Vue {
  @Prop() tabIndex: number;
  @Prop() tabItems: string[];

  @Prop() onCancel: Function;
  @Prop() onPrint: Function;
  @Prop() onUpload: Function;

  private tab = this.tabIndex;

  @Emit("update:tabIndex")
  updateTabIndex() {
    return this.tab;
  }

  onTabChange() {
    this.updateTabIndex();
  }
}
</script>
