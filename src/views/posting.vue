<template>
  <v-container id="dashboard" fluid grid-list-lg class="mx-0 pa-3">
    <v-layout wrap>
      <!-- Summary Section -->
      <v-flex lg4>
        <v-layout wrap>
          <v-flex xs12>
            <fiscal-year-balance-card :fiscalBalance="fiscalBalance" @onSave="actionSave"></fiscal-year-balance-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Datatable section -->
      <v-flex lg8>
        <v-data-table
          class="elevation-1 pb-3"
          :footer-props="defaultFooterProps"
          :headers="headers"
          :items="items"
          :items-per-page="options.itemsPerPage"
          :loading="loading"
          :options.sync="options"
          :server-items-length="serverItemsLength"
          @update:options="handleUpdateOptions"
        >
          <!-- Top Slot -->
          <template v-slot:top>
            <v-toolbar text color="grey lighten-5" elevation="0">
              <search-text-field @onFilter="handleFilter"></search-text-field>
              <v-spacer class="hidden-xs-only"></v-spacer>

              <print-button @click="handlePrint"> </print-button>
              <refresh-button @click="handleRefresh"> </refresh-button>
            </v-toolbar>
          </template>

          <template v-slot:item.PostingDate="{ item }">
            <format-date :dateStr="item.PostingDate" format="YYYY-MM-DD"></format-date>
          </template>

          <template v-slot:item.PostingCloseDate="{ item }">
            <format-date :dateStr="item.PostingCloseDate" format="YYYY-MM-DD"></format-date>
          </template>

          <template v-slot:item.action="{ item }">
            <invoice-dialog :postItem="item" />
            <eod-closing-dialog
              v-if="item.PostingFlag == 0"
              isEdit="true"
              :item="item"
              @onSave="handleSave"
              @onCancel="handleCancel"
            />
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IOptions, IPosPosting, IFiscalBalance } from "@/types";
import * as api from "@/services";
import _ from "lodash";
import ExcelExport from "@/mixins/excel-export";

@Component({
  components: {
    InvoiceDialog: () => import("@/components/dialog/invoice-dialog.vue"),
    EodClosingDialog: () => import("@/components/dialog/eod-closing-dialog.vue"),
    // ActionsOrder: () => import("@/components/datatable/actions-order.vue"),
    PrintButton: () => import("@/components/button/print-button.vue"),
    RefreshButton: () => import("@/components/button/refresh-button.vue"),
    SearchTextField: () => import("@/components/input/search-text-field.vue"),
    FormatDate: () => import("@/components/datatable/format-date.vue"),
    FiscalYearBalanceCard: () => import("@/components/card/fiscal-year-balance-card.vue")
  },
  mixins: [ExcelExport]
})
export default class Posting extends Vue {
  // datatable settings
  private loading = false;
  private items = [];
  private item: any = {};
  private filter = "";
  private serverItemsLength: number = 0;

  // datatable options
  private options: IOptions = { sortBy: ["PostingId"], sortDesc: [true], itemsPerPage: 10 };

  // Mixins
  defaultFooterProps;
  setSortOptions: Function;
  processApiCall: Function;
  exportExcel: Function;
  fetchData: Function;
  saveRecord: Function;
  saveImage: Function;

  // Others
  private title = "FY2019";
  private data = 100000;
  private btnText = "Set Open Balance";
  private amount = 789;

  private fiscalBalance: IFiscalBalance = {} as IFiscalBalance;

  get headers() {
    return [
      { text: "Posting Id", value: "PostingId", width: "6vw", divider: true },
      { text: "Open Date", value: "PostingDate", divider: true },
      { text: "Opening", value: "Opening", align: "right", divider: true },
      { text: "Posting", value: "PostingAmount", align: "right", divider: true },
      { text: "Closing", value: "Closing", align: "right", divider: true },
      { text: "Close Date", value: "PostingCloseDate", divider: true },
      { text: "Inv. From", value: "InvoiceFrom", divider: true, align: "right" },
      { text: "Inv. To", value: "InvoiceTo", divider: true, align: "right" },
      { text: "Staff Code", value: "StaffCode", divider: true },
      { text: "Status", align: "right", value: "PostingFlag", width: "5vw", divider: true },
      { text: "", align: "left", value: "action", sortable: false }
    ];
  }

  get fiscalYearOpenBalance() {
    return this.$n(this.fiscalBalance.Opening);
  }

  // Button click Handler
  private handleCancel() {
    // this.closeDialog();
    this.refreshData();
  }

  private handleFilter(filterText: string) {
    this.filter = filterText;
    this.refreshData();
  }

  private handlePrint(obj: any) {
    this.exportExcel(api.exportPosPosting, this.showLoading, "postings.xlsx");
  }

  private handleRefresh() {
    this.refreshData();
  }

  private handleSave() {}

  private handleUpdateOptions = opt => {
    const { page, itemsPerPage, sortBy, sortDesc } = opt;
    this.setSortOptions(this.options, sortBy, sortDesc);
    this.options.itemsPerPage = itemsPerPage;
    this.refreshData();
  };

  private actionCancel() {
    this.refreshData();
  }

  private refreshData() {
    this.fetchData(this.options, this.filter, api.getPosPostings, this.loadItems, this.showLoading);
  }

  private loadItems(response: any) {
    this.items = response.data;
    this.serverItemsLength = response.total;
  }

  private showLoading(loading) {
    this.loading = loading;
  }
  // CRUD
  private actionSave(result: any) {
    // confirm(result.Opening.toString());
    this.setFiscalBalance(result);
  }

  private async setFiscalBalance(obj: any) {
    this.loading = true;
    try {
      let objFiscalBalance = {
        StaffCode: obj.StaffCode,
        OpeningDate: obj.OpeningDate,
        Opening: obj.Opening
      };
      const response = await api.setFiscalYearBalance(objFiscalBalance);
    } catch (e) {
      this.fetchFiscalBalance();
      this.refreshData();
      // console.log("add session failed..", e);
    } finally {
      this.fetchFiscalBalance();
      this.refreshData();
      this.loading = false;
    }
  }

  private actionCreate(item: IPosPosting) {
    if (_.isEmpty(item) == false) {
      this.fetchADdData(item);
    }
  }

  private actionPrint(item: any) {}

  private actionUpdate(item: any) {
    this.doEodPosting(item);
  }

  private async fetchFiscalBalance() {
    this.loading = true;

    try {
      const response = await api.getFiscalBalance();

      this.fiscalBalance = response.FiscalBalance;
    } catch (e) {
      console.log("fetchInvoice outstanding amount failed..", e);
    } finally {
      this.loading = false;
    }
  }

  private async fetchADdData(obj: any) {
    this.loading = true;
    try {
      let objStaff = { StaffCode: obj.StaffCode };
      const response = await api.addSession(objStaff);
      // alert("Add - response.data.Status");
    } catch (e) {
      console.log("add session failed..", e);
    } finally {
      this.refreshData();
      this.loading = false;
    }
  }

  private async doEodPosting(obj: any) {
    this.loading = true;
    try {
      const response = await api.editPosPosting(obj);
      // alert("Edit - response.data.Status");
    } catch (e) {
      console.log("edit Posting failed..", e);
    } finally {
      this.refreshData();
      this.loading = false;
    }
  }

  created() {
    this.fetchFiscalBalance();
  }
}
</script>

<style>
.wrapperUtils {
  display: flex;
  justify-content: flex-end;
}
</style>
