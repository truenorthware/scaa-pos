<template>
  <v-card>
    <v-card-title>Invoices (Pending Posting)</v-card-title>
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
      <template v-slot:top>
        <slot-top-invoice-card
          :item="item"
          @onFilter="handleFilter"
          @onPrint="handlePrint"
          @onRefresh="actionRefresh"
        />
      </template>

      <template v-slot:item.InvoiceDate="{ item }">
        <format-date :dateStr="item.InvoiceDate" format="YYYY-MM-DD"></format-date>
      </template>

      <template v-slot:item.Actions="{ item }">
        <actions-invoice-card :item.sync="item" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { IOptions, IInvoiceItem } from "@/types";
import * as api from "@/services";
import _ from "lodash";

const name = "invoice-card";

@Component({
  components: {
    FormatDate: () => import("@/components/datatable/format-date.vue"),
    SlotTopInvoiceCard: () => import("@/components/datatable/slot-top-invoice-card.vue"),
    ActionsInvoiceCard: () => import("@/components/datatable/actions-invoice-card.vue")
  }
})
export default class InvoiceCard extends Vue {
  get headers() {
    return [
      { text: "Invoice#", align: "right", value: "InvoiceNumber", width: "5vw" },
      { text: "Invoice Date", value: "InvoiceDate", width: "5vw" },
      { text: "Posting Id", align: "left", value: "PostingId", width: "4vw" },
      { text: "Customer Code", value: "CustomerCode" },
      { text: "Staff Code", value: "StaffCode" },
      { text: "Invoice Amount", value: "InvoiceAmount", align: "right" },
      { text: "Ref.", value: "RefInvoiceNumber" },
      { text: "Actions", width: "8vw", align: "left", value: "Actions", sortable: false }
    ];
  }
  // { text: "Flag", value: "Flag" },

  private options: IOptions = { sortBy: ["InvoiceNumber"], sortDesc: [true], itemsPerPage: 10 };

  private loading = false;
  private items = [];
  private item = {} as IInvoiceItem;
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

  private handleFilter(filterText: string) {
    this.filter = filterText;
    this.actionRefresh();
  }

  private handlePrint(obj: any) {
    this.exportInvoicePendingPosting();
  }

  private async exportInvoicePendingPosting() {
    this.loading = true;
    try {
      const response = await api.exportInvoicePendingPosting();

      this.forceFileDownload(response);
    } catch (e) {
      this.loading = false;
      console.log("export customer failed..", e);
    } finally {
      this.loading = false;
    }
  }

  private actionGetInvoiceByPostingId() {
    console.log("options" + JSON.stringify(this.options));
    let sortParams = _.zipWith(this.options.sortBy, this.options.sortDesc, function(by, isDesc) {
      return isDesc ? by + "|desc" : by;
    }).join(",");
    this.fetchInvoice(this.options.page, this.options.itemsPerPage, sortParams, this.filter);
  }

  private actionRefresh() {
    this.item = Object.assign({}, {} as IInvoiceItem);
    console.log("options" + JSON.stringify(this.options));
    let sortParams = _.zipWith(this.options.sortBy, this.options.sortDesc, function(by, isDesc) {
      return isDesc ? by + "|desc" : by;
    }).join(",");
    this.fetchInvoice(this.options.page, this.options.itemsPerPage, sortParams, this.filter);
  }

  private async fetchInvoice(pageNo, pageSize: number, sort?: string, filter?: string) {
    this.loading = true;
    try {
      const response = await api.getInvoicesOutstanding(pageNo, pageSize, sort, filter);

      this.items = response.data;
      this.itemsPerPage = response.per_page;
      this.serverItemsLength = response.total;
    } catch (e) {
      console.log("fetchInvoice failed..", e);
    } finally {
      this.loading = false;
    }
  }

  private forceFileDownload(response) {
    var blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    // link.download = "file.xlsx";
    link.setAttribute("download", "invoice-pending-posting.xlsx"); //or any other extension
    document.body.appendChild(link);
    link.click();
  }
}
</script>
