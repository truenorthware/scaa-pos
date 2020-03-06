<template>
  <div>{{ isoDate }}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";

@Component({})
export default class FormatNumber extends Vue {
  @Prop({ default: "N/A" }) dateStr!: string;
  @Prop({ default: "YYYY-MM-DD hh:mm" }) format!: string;

  get isoDate() {
    let date = moment(this.dateStr);
    if (date.isValid()) {
      return moment(this.dateStr).format(this.format);
    } else {
      return "";
    }
  }
}
</script>
