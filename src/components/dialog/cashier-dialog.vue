<template>
  <v-dialog v-model="showDialog" scrollable width="480">
    <template v-slot:activator="{ on }">
      <v-btn icon depressed slot="activator" v-on="on">
        <v-avatar color="secondary" size="36">
          <!-- <span class="white--text headline">{{ cashier.substring(0, 1) }}</span> -->
          <span class="white--text headline">
            {{ avatarInitial }}
          </span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Select Cashier</v-card-title>
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
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { IOptions, IStaff } from "@/types";
import * as api from "@/services";
import _ from "lodash";

const name = "cashier-dialog";

@Component({})
export default class CashierDialog extends Vue {
  private showDialog = false;
  private selectedAdmin: number = 0;

  get headers() {
    return [
      { text: this.$t("StaffCode"), width: "8vw", divider: true, value: "StaffCode" },
      { text: this.$t("StaffName"), width: "10vw", value: "StaffName", divider: true }
    ];
  }

  private options: IOptions = { sortBy: ["StaffCode"], sortDesc: [], itemsPerPage: 10 };

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
      const response = await api.getStaff(pageNo, pageSize, sort, filter);
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
  // @Watch("showDialog", { deep: true })
  // @mount()
  // private async onOptionsChange() {
  // private async mount() {
  //   console.log("watch - option - inside properties-rent");
  //   console.log(JSON.stringify(this.options));
  //   await this.fetchData(this.options.page, this.options.itemsPerPage);
  // }
}
</script>
