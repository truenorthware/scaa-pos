<template>
  <v-dialog v-model="showDialog" eager persistent width="800px" transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn icon depressed v-on="on">
        <v-icon>remove_red_eye</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Invoices</v-card-title>
      <v-divider></v-divider>
      <v-data-table
        class="elevation-1 pb-3"
        :footer-props="footerProps"
        :headers="headers"
        :items="items"
        :items-per-page="itemsPerPage"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverItemsLength"
        @update:options="handleUpdateOptions"
      >
        <template v-slot:item.InvoiceDate="{ item }">
          <format-date :dateStr="item.InvoiceDate"></format-date>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-btn class="ml-auto" color="grey darken-1" text @click="showDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { IOptions, IPosPosting, IProduct } from "@/types";
import * as api from "@/services";
import _ from "lodash";

const name = "invoice-dialog";

@Component({
  components: {
    FormatDate: () => import("@/components/datatable/format-date.vue")
  }
})
export default class InvoiceDialog extends Vue {
  private showDialog = false;
  private selectedAdmin: number = 0;
  @Prop({ default: {} as IPosPosting }) postItem?: IPosPosting;

  get headers() {
    return [
      {
        text: "Invoice Number",
        align: "left",
        sortable: false,
        value: "InvoiceNumber"
      },
      { text: "Invoice Date", value: "InvoiceDate" },
      { text: "Posting Close Date", value: "PostingCloseDate" },
      { text: "Posting Id", align: "center", value: "PostingId" },
      { text: "Customer Code", value: "CustomerCode" },
      { text: "Staff Code", align: "center", value: "StaffCode" },
      { text: "Invoice Amount", align: "center", value: "InvoiceAmount" }
    ];
  }

  private options: IOptions = { sortBy: ["InvoiceNumber"], sortDesc: [], itemsPerPage: 10 };

  private loading = false;
  private items = [];
  private item: any = {};
  private filter = "";
  private itemsPerPage: number = 10;
  private serverItemsLength: number = 0;

  // footer options
  private footerProps = {
    showCurrentPage: true,
    showFirstLastPage: true,
    itemsPerPageOptions: [10, 25, 50, 100],
    itemsPerPageText: "每頁顯示"
  };

  private handleUpdateOptions = opt => {
    const { page, itemsPerPage, sortBy, sortDesc } = opt;
    this.itemsPerPage = itemsPerPage;

    if (sortBy.length > 0 && this.options.sortBy[0] != sortBy[0]) {
      this.options.sortBy = sortBy;
    }
    if (sortDesc.length > 0 && this.options.sortDesc[0] != sortDesc[0]) {
      this.options.sortDesc = sortDesc;
    } else if (sortBy.length <= 0) {
      this.options.sortDesc = this.options.sortDesc ? [false] : [true];
      this.options.sortBy = sortBy;
      this.options.sortDesc = sortDesc;
      console.log(JSON.stringify(this.options));
    }
    this.actionGetInvoiceByPostingId();
  };

  private actionGetInvoiceByPostingId() {
    // this.item = Object.assign({}, {} as IPosPosting);
    console.log("options" + JSON.stringify(this.options));
    let sortParams = _.zipWith(this.options.sortBy, this.options.sortDesc, function(by, isDesc) {
      return isDesc ? by + "|desc" : by;
    }).join(",");
    this.fetchInvoice(this.options.page, this.options.itemsPerPage, sortParams, this.filter);
  }

  private async fetchInvoice(pageNo, pageSize: number, sort?: string, filter?: string) {
    this.loading = true;
    try {
      let postingId = this.postItem.PostingId;
      const response = await api.getInvoices(pageNo, pageSize, sort, filter, postingId);

      this.items = response.data;
      this.itemsPerPage = response.per_page;
      this.serverItemsLength = response.total;
    } catch (e) {
      console.log("fetchInvoice failed..", e);
    } finally {
      this.loading = false;
    }
  }
}
</script>
