<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <template v-if="isEdit">
        <v-btn slot="activator" v-on="on" text icon color="primary">
          <v-icon>edit</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          depressed
          slot="activator"
          v-on="on"
          class="secondary text-capitalize white--text"
          tile
          text
        >
          <v-icon color="white" class="mr-2">add</v-icon>
          <span class="mr-2"> {{ $t("button-text-add") }} </span>
        </v-btn>
      </template>
    </template>

    <v-form v-model="validInput">
      <v-card>
        <v-card-title primary-title>{{ title }}</v-card-title>
        <v-divider></v-divider>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 v-if="isEdit">
              <v-text-field
                v-model="item.PostingDate"
                :label="$t('label-order-posting-date')"
                :disabled="isEdit"
              />
            </v-flex>
            <v-flex xs12 v-if="isEdit">
              <v-text-field
                v-model="item.PostingCloseDate"
                :label="$t('label-order-posting-close-date')"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="item.StaffCode"
                v-mask="maskStaffCode"
                :label="$t('label-order-staff-code')"
                :rules="[rules.required]"
              />
            </v-flex>
            <v-flex xs12 v-if="isEdit">
              <v-text-field
                v-model="item.PostingFlag"
                :label="$t('label-order-posting-posting-flag')"
                :disabled="isEdit"
              />
            </v-flex>
          </v-layout>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="handleCancel">{{ $t("button-text-cancel") }}</v-btn>
          <v-btn color="primary" text @click="handleSave" :disabled="validInput == false">{{
            $t("button-text-confirm")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { IPosPosting } from "@/types";
// import VNumberField from "@paulpv/vuetify-number-field";
import { MASK_16A } from "@/utils/const";
import { mask } from "vue-the-mask";

@Component({
  directives: {
    mask
  }
})
export default class OrderDialog extends Vue {
  private showDialog = false;

  private rules = { required: value => !!value || "Required" };
  private validInput: boolean = false;

  private maskStaffCode = MASK_16A;
  @Prop({ default: {} as IPosPosting }) item?: IPosPosting;
  @Prop({ default: false }) isEdit?: boolean;
  @Prop({ default: "" }) title?: string;

  get viewMode() {
    return this.isEdit;
  }

  @Emit("onSave")
  handleSave() {
    this.showDialog = false;
    return this.item;
  }

  @Emit("onCancel")
  handleCancel() {
    this.showDialog = false;
    return this.item;
  }
}
</script>
<style scoped>
.capitalize-text input {
  text-transform: uppercase !important;
}
</style>
