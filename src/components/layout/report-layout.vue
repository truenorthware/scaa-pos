<template>
  <v-layout column wrap class="pa-4 ma-0 grey lighten-4" align-center>
    <v-flex xs3 class="pa-0 ma-0">
      <!-- receipt -->
      <div id="receipt-wrapper" v-if="invoiceItem">
        <div id="receipt" class="wrapperReceipt elevation-1">
          <p>
            {{ formatDt(invoiceItem ? invoiceItem.InvoiceDate : "") }} Inv Number-{{
              invoiceItem ? invoiceItem.InvoiceNumber : ""
            }}
          </p>
          <!-- TODO: Company name -->
          <p>{{ invoiceItem ? invoiceItem.CompanyName : "" }}</p>
          <!-- TODO: Cashier -->
          <p>User: {{ invoiceItem ? invoiceItem.StaffCode : "" }}</p>
          <br />
          <table>
            <colgroup>
              <col width="50%" />
              <col width="25%" />
              <col width="25%" />
            </colgroup>
            <tbody>
              <!-- items -->
              <tr v-for="(item, i) in invoiceItem.InvoiceLines" :key="i">
                <td>
                  <p>{{ item.ProductCode }}</p>
                  <div class="disc-font" v-if="item.DiscountPercent !== 0">
                    With a {{ item.DiscountPercent }}% discount
                  </div>
                </td>
                <td>
                  <p class="right">{{ item.Quantity }} {{ item.ProductUnit }}</p>
                </td>
                <td>
                  <p class="right">{{ item.Amount }}$</p>
                </td>
              </tr>
              <br />
              <!-- subtotal -->
              <tr>
                <td>
                  <p>Subtotal:</p>
                </td>
                <td></td>
                <td>
                  <p class="right">{{ invoiceItem ? invoiceItem.InvoiceAmount : "" }}$</p>
                </td>
              </tr>
              <!-- total -->
              <tr>
                <td>
                  <h3>Total:</h3>
                </td>
                <td></td>
                <td>
                  <h2 class="right">{{ invoiceItem ? invoiceItem.InvoiceAmount : "" }}$</h2>
                </td>
              </tr>
              <br />
              <!-- cash -->
              <tr>
                <td>
                  <p>
                    {{
                      invoiceItem && invoiceItem.PaymentMethod === 1 ? `Cash (HKD)` : "Credit Card"
                    }}
                  </p>
                </td>
                <td></td>
                <td>
                  <p class="right">{{ invoiceItem ? invoiceItem.PaymentAmount : "" }}$</p>
                </td>
              </tr>
              <!-- change -->
              <tr>
                <td>
                  <p>Change:</p>
                </td>
                <td></td>
                <td>
                  <p class="right">{{ invoiceItem ? invoiceItem.ChangeAmount : "" }}$</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </v-flex>
    <!--
    <v-btn color="secondary" x-large max-width="320" class="ma-4" @click="print"
      >Print Receipt</v-btn
    >
    -->
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { IInvoiceResponse } from "@/types";
import { getPrintContent } from "@/utils";

import moment from "moment";

@Component({})
export default class ReportLayout extends Vue {
  //  private currentDt = moment().format("LLL");
  // properties
  @Prop({ default: null }) invoiceItem?: IInvoiceResponse;
  // @Prop({ default: 0 }) selectedPaymentMethod?: number;

  // @Prop({ default: 0 }) changeAmount?: number;
  // @Prop({ default: 0 }) tenderedAmount?: number;
  // @Prop({ default: 0 }) totalAmount?: number;

  private formatDt(dtString: string): string {
    return moment(dtString).format("LLL");
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

<style>
.wrapperReceipt {
  padding: 16px;
  background: #fff;
  border: 1px solid #d9d9d9;
  width: 400px;
  font-family: monospace;
}
.wrapperReceipt table {
  width: 100%;
  border: 0;
  table-layout: fixed;
  font-family: monospace;
}
.wrapperReceipt tbody {
  width: 100%;
  display: table-row-group;
  vertical-align: middle;
}

.wrapperReceipt .disc-font {
  font-size: 12px;
  font-style: italic;
}

.wrapperReceipt p {
  margin-bottom: 0;
}
.right {
  text-align: right;
}
</style>
