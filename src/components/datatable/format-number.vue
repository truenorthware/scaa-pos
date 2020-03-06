<template>
  <div>{{ isoDate }}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";

@Component({})
export default class FormatDate extends Vue {
  @Prop({ default: "N/A" }) dateStr!: string;

  get isoDate() {
    return moment(this.dateStr).format("YYYY-MM-DD hh:mm");
    // return this.dateStr;
  }
}
</script>
