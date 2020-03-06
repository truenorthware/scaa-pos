<template>
  <v-dialog v-model="showDialog" scrollable max-width="60%">
    <template v-slot:activator="{ on }">
      <v-btn depressed slot="activator" v-on="on" class="secondary--text user-btn" text>
        <v-icon size="small" color="secondary" left>fas fa-user</v-icon>
        <span class="mr-2">
          {{ custInitial }}
        </span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Select Customer</v-card-title>
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
      </v-data-table>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="grey darken-1" text @click="showDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
const name = "customer-dialog";

import { Component, Emit, Prop, Vue, Watch, PropSync } from "vue-property-decorator";
import { ICustomer } from "@/types";
import { IOptions } from "@/types";
import * as api from "@/services";
import _ from "lodash";

@Component
export default class CustomerSelectDialog extends Vue {
  // private showDialog = false;
  // // customer dialog
  // private selectedCustomer: number = 1;

  // private options: IOptions = {
  //   sortBy: ["RestaurantId"],
  //   groupBy: ["Type"],
  //   itemsPerPage: 1000
  // };

  // private loading = false;
  // private items = [];
  // private totalItems = -1;

  // get custInitial(): string {
  //   if (this.items.length > 0) {
  //     return this.items[this.selectedCustomer].CustomerName;
  //   } else {
  //     return "";
  //   }
  // }

  // async fetchData(pageNo, pageSize: number, sort?: string, filter?: string) {
  //   console.log("fetchProducts ");
  //   this.loading = true;
  //   try {
  //     const response = await api.getCustomers(pageNo, pageSize, sort, filter);
  //     this.items = response.data;

  //     this.totalItems = response.total;
  //   } catch (e) {
  //     console.log("fetchBusFleet failed..", e);
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // @Watch("showDialog", { deep: true })
  // private async onOptionsChange() {
  //   console.log("watch - option - inside properties-rent");
  //   console.log(JSON.stringify(this.options));
  //   await this.fetchData(this.options.page, this.options.itemsPerPage);
  // }

  private showDialog = false;
  private selectedAdmin: number = 0;

  get headers() {
    return [
      { text: this.$t("CustomerCode"), width: "8vw", divider: true, value: "CustomerCode" },
      { text: this.$t("CustomerName"), width: "10vw", value: "CustomerName", divider: true }
    ];
  }

  get custInitial(): string {
    return "Customer";
    // if (this.items.length > 0) {
    //   return this.items[this.selectedCustomer].CustomerName;
    // } else {
    //   return "";
    // }
  }

  private options: IOptions = { sortBy: ["CustomerCode"], sortDesc: [], itemsPerPage: 10 };

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

  get avatarInitial(): string {
    if (this.items.length > 0) {
      return this.items[this.selectedAdmin].StaffName.substring(0, 1);
    } else {
      return "";
    }
  }

  async fetchData(pageNo, pageSize: number, sort?: string, filter?: string) {
    console.log("fetchStaff ");
    this.loading = true;
    try {
      const response = await api.getCustomers(pageNo, pageSize, sort, filter);
      this.items = response.data;

      this.serverItemsLength = response.total;
    } catch (e) {
      console.log("fetchStaff failed..", e);
    } finally {
      this.loading = false;
    }
  }

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
    this.actionRefresh();
  };

  private actionRefresh() {
    console.log("options" + JSON.stringify(this.options));
    let sortParams = _.zipWith(this.options.sortBy, this.options.sortDesc, function(by, isDesc) {
      return isDesc ? by + "|desc" : by;
    }).join(",");
    this.fetchData(this.options.page, this.options.itemsPerPage, sortParams, this.filter);
  }
}
</script>
<style scoped>
.user-btn {
  border-radius: 0px;
  border-color: #f0eef0 !important;
  border-bottom: none !important;
  height: 60px !important;
}
</style>
