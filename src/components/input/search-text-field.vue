<template>
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
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component({})
export default class SearchTextField extends Vue {
  private filterText = "";

  @Emit("onFilter")
  handleFilter() {
    return this.filterText;
  }

  @Emit("onFilter")
  handleReset() {
    this.filterText = ""; // clear the text in text input
    return this.filterText;
  }
}
</script>
