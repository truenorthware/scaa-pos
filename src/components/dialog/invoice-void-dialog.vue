<template>
  <v-dialog v-model="showDialog" width="606">
    <template v-slot:activator="{ on }">
      <v-btn slot="activator" v-on="on" text icon color="danger">
        <v-icon>cancel</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title primary-title>{{ title }}</v-card-title>
      <v-divider></v-divider>
      <v-stepper v-model="step" class="elevation-0">
        <!-- stepper headers -->
        <v-stepper-header class="elevation-0">
          <v-stepper-step :complete="step > 1" step="1">Confirm Payment</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2">Print Receipt</v-stepper-step>
        </v-stepper-header>
        <v-divider></v-divider>
        <v-stepper-items style="height: 410px;overflow-y: auto;">
          <!-- confirm payment step -->
          <v-stepper-content step="1" class="pa-0 ma-0">
            <v-card-text>{{ "Invoice Number: " + item.InvoiceNumber }}</v-card-text>
            <v-textarea label="Input the Reason" rows="9" v-model="reason" class="pa-3"></v-textarea>
            <!-- <v-card-text
              >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the 1500s,</v-card-text
            > -->
          </v-stepper-content>
          <!-- print receipt step -->
          <v-stepper-content step="2" class="pa-0 ma-0">
            <report-layout v-if="step == 2" :invoiceItem="invoiceItem" :selectedPaymentMethod="selectedPaymentMethod" />
            <!-- :changeAmount="changeAmount"
              :tenderedAmount="tenderedAmount"
              :totalAmount="selectedPaymentMethod" -->
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn x-large color="grey darken-2" text @click="showDialog = false">{{ $t("button-text-cancel") }}</v-btn>
        <v-btn x-large color="darken-1" text @click="doValidate" v-if="step == 1">Next Step</v-btn>
        <v-btn v-btn x-large max-width="320" class="ml-2" text color="darken-1" v-if="step == 2" @click="print"
          >Print Receipt</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { IInvoiceReversalRequest, IInvoiceResponse } from "@/types";
import * as api from "@/services";
import { getPrintContent } from "@/utils";

@Component({
  components: {
    ReportLayout: () => import("@/components/layout/report-layout.vue")
  }
})
export default class InvoiceVoidDialog extends Vue {
  private showDialog = false;
  public reason = "";
  private step = 1;
  private selectedPaymentMethod = 1;
  private invoiceItem: IInvoiceResponse = null;
  @Prop({ default: {} as any }) item?: any;
  @Prop({ default: "" }) title?: string;
  mounted() {
    console.log(this.item);
  }

  @Emit("onDelete")
  private doValidate() {
    if (this.reason == "") return;
    let request: IInvoiceReversalRequest = {
      StaffCode: "POS",
      Reasons: this.reason,
      OldInvoiceNumber: this.item.InvoiceNumber
    };
    console.log(this.item.InvoiceNumber);

    this.createInvoiceReversal(request);
    // return this.item;
  }

  private async createInvoiceReversal(obj: any) {
    try {
      {
        let request: IInvoiceReversalRequest = {
          StaffCode: "POS",
          OldInvoiceNumber: this.item.InvoiceNumber,
          Reasons: this.reason
        };

        let response = await (api.createInvoiceReversal(obj) as any);
        // let response = await (api.getInvoiceById(this.item.InvoiceNumber) as any);
        let r1 = response as IInvoiceResponse;
        this.invoiceItem = r1;
      }
      // {
      //   await (api.createInvoiceReversal(obj) as any);
      // }
      this.step = 2;
    } catch (e) {
      confirm("Problem create invoice reversal");
      console.log("create invoice reversal failed..", e);
    }
  }

  print() {
    // Pass the element id here
    const element = document.getElementById("receipt-wrapper");

    // const url = "";
    // const win = window.open(url, name, '"fullscreen=no","titlebar=no","scrollbars=yes"');

    // eslint-disable
    /* eslint-disable */
    const content = getPrintContent(element.innerHTML);

    const iframe: any = document.getElementById("printFrame");
    iframe.src = "data:text/html;charset=utf-8," + encodeURI("");
    iframe.src = "data:text/html;charset=utf-8," + encodeURI(content);
  }
}
</script>
