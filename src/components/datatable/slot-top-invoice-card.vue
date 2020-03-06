<template>
  <v-toolbar text color="grey lighten-5" elevation="0">
    <v-text-field
      v-model="filterText"
      :placeholder="$t('placeholder-text-search')"
      append-icon="search"
      clear-icon="clear"
      clearable
      hide-details
      @keyup.enter="handleFilter"
      @click:append="handleFilter"
      @click:clear="handleReset"
    ></v-text-field>

    <v-spacer class="hidden-xs-only"></v-spacer>

    <v-btn text icon @click="handlePrint"> <v-icon>print</v-icon> </v-btn>
    <v-btn text icon @click="handleRefresh"> <v-icon>refresh</v-icon> </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

@Component({})
export default class SlotTopOrder extends Vue {
  private filterText: string = "";

  @Emit("onFilter")
  handleFilter() {
    return this.filterText;
  }

  @Emit("onPrint")
  private handlePrint() {
    return true;
  }

  @Emit("onRefresh")
  private handleRefresh() {
    return true;
  }

  private handleReset() {
    this.filterText = ""; // clear the text in text input
    this.handleFilter();
  }
}
</script>
