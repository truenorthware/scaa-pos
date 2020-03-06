<template>
  <v-dialog v-model="showDialog" width="500">
    <template v-slot:activator="{ on }">
      <v-btn slot="activator" v-on="on" text icon color="danger">
        <v-icon>delete</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title primary-title>{{ title }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="showDialog = false">{{ $t("button-text-cancel") }}</v-btn>
        <v-btn color="primary" text @click="handleConfirm">{{ $t("button-text-confirm") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

@Component({})
export default class DeleteDialog extends Vue {
  private showDialog = false;

  @Prop({ default: {} as any }) item?: any;
  @Prop({ default: "" }) title?: string;

  @Emit("onDelete")
  handleConfirm() {
    this.showDialog = false;
    return this.item;
  }
}
</script>
