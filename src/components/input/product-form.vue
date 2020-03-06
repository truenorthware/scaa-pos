<template>
  <v-form ref="form" v-model="validInput" lazy-validation>
    <v-card>
      <v-card-title primary-title>{{ title }}</v-card-title>
      <v-divider></v-divider>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="item.ProductCode"
              v-mask="maskProductCode"
              :disabled="isEdit"
              :label="$t('label-product-code')"
              :rules="[rules.required]"
              onkeyup="this.value = this.value.toUpperCase();"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="item.ProductName" :label="$t('label-product-name')" :rules="[rules.required]" />
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="item.ProductUnit" :label="$t('label-unit')" :rules="[rules.required]" />
          </v-flex>
          <!-- v-money="money" -->
          <v-flex xs12>
            <v-text-field
              type="number"
              v-model.lazy="item.UnitPrice"
              :label="$t('label-unit-price')"
              :rules="[rules.required]"
            />
            <!-- <money v-model="item.UnitPrice" v-bind="money"></money> -->
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
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { IProduct } from "@/types";
import { MASK_16A } from "@/utils/const";
import { mask } from "vue-the-mask";

@Component({
  directives: {
    mask
  }
})
export default class ProductForm extends Vue {
  private showDialog = false;
  private rules = { required: value => !!value || "Required" };
  private validInput: boolean = false;
  private maskCustomerCode = MASK_16A;

  private emailRules = [v => !!v || "E-mail is required", v => /.+@.+/.test(v) || "E-mail must be valid"];

  @Prop({ default: {} as IProduct }) item?: IProduct;
  @Prop({ default: false }) isEdit?: boolean;
  @Prop({ default: "" }) title?: string;

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
