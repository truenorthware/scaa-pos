<template>
  <v-dialog v-model="showDialog" width="606">
    <template v-slot:activator="{ on }">
      <v-btn slot="activator" v-on="on" text icon color="primary">
        <v-icon>print</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title primary-title>{{ title }}</v-card-title>

      <report-layout :invoiceItem="invoiceItem" :selectedPaymentMethod="selectedPaymentMethod" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn x-large text color="grey darken-1" @click="showDialog = false">{{ $t("button-text-cancel") }}</v-btn>
        <v-btn x-large max-width="320" class="ml-2" text color="darken-1" @click="print">Print Receipt</v-btn>
      </v-card-actions>
    </v-card>
    <iframe
      ref="printFrame"
      id="printFrame"
      style="display: none; position: absolute; opacity:1; z-index:-99;"
    ></iframe>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";
import { IInvoiceResponse, IInvoiceItem } from "@/types";
import * as api from "@/services";
import { getPrintContent } from "@/utils";

@Component({
  components: {
    ReportLayout: () => import("@/components/layout/report-layout.vue")
  }
})
export default class InvoiceReprintDialog extends Vue {
  private invoiceItem: IInvoiceResponse = null;
  private selectedPaymentMethod = 1;
  private tenderedAmount = 0.0;
  private totalAmount = 0.0;

  private showDialog = false;

  @Prop({ default: {} as IInvoiceItem }) item?: IInvoiceItem;
  @Prop({ default: "" }) title?: string;

  @Emit("onDelete")
  handleConfirm() {
    this.showDialog = false;
    return this.item;
  }

  async created() {
    //let id = 3;
    let id = this.item.InvoiceNumber;

    let response = await (api.getInvoiceById(id) as any);
    let r1 = response as IInvoiceResponse;
    this.invoiceItem = r1;
  }

  print() {
    // Pass the element id here
    const element = document.getElementById("receipt-wrapper");
    const content = getPrintContent(element.innerHTML);
    const iframe: any = document.getElementById("printFrame");

    iframe.src = "data:text/html;charset=utf-8," + encodeURI("");
    iframe.src = "data:text/html;charset=utf-8," + encodeURI(content);
  }
}
</script>
