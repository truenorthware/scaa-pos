<template>
  <v-form ref="form" v-model="validInput" lazy-validation>
    <v-card>
      <v-card-title primary-title>{{ title }}</v-card-title>
      <v-divider></v-divider>

      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="item.CustomerCode"
              v-mask="maskCustomerCode"
              :disabled="isEdit"
              :label="$t('CustomerCode')"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field
              v-model="item.CustomerName"
              :label="$t('CustomerName')"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field
              v-model="item.PhoneNumber"
              :label="$t('CustomerPhoneNumber')"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field v-model="item.MobileNumber" :label="$t('CustomerMobileNumber')"></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field v-model="item.email" :label="$t('CustomerEmail')" :rules="emailRules"></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field v-model="item.address1" :label="$t('CustomerAddress')"> </v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field v-model="item.address2" placeholder="Address line 2"></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field v-model="item.address3" placeholder="Address line 3"></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field v-model="item.address4" placeholder="Address line 4"></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-text-field v-model="item.country" :label="$t('CustomerCountry')"></v-text-field>
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
import { ICustomer1 } from "@/types";
import { MASK_16A } from "@/utils/const";
import { mask } from "vue-the-mask";

@Component({
  directives: {
    mask
  }
})
export default class CustomerForm extends Vue {
  private showDialog = false;
  private rules = { required: value => !!value || "Required" };
  private validInput: boolean = false;
  private maskCustomerCode = MASK_16A;

  private emailRules = [v => !!v || "E-mail is required", v => /.+@.+/.test(v) || "E-mail must be valid"];

  @Prop({ default: {} as ICustomer1 }) item?: ICustomer1;
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
