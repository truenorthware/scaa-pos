<template>
  <v-flex xs12d class="pa-3">
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

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn text large icon v-on="on"> <v-icon>add_circle</v-icon> </v-btn>
            </template>
            <staff-form :item="editedItem" :title="formTitle" @onSave="handleSave" @onCancel="handleCancel" />
          </v-dialog>

          <print-button @click="handlePrint"> </print-button>
          <refresh-button @click="handleRefresh"> </refresh-button>
        </v-toolbar>
      </template>

      <!-- Action Slot -->
      <template v-slot:item.Actions="{ item }">
        <edit-button @click="editItem(item)"> </edit-button>
        <delete-dialog :item="editedItem" :title="$t('dialog-title-delete-customer')" @onDelete="handleDelete" />
      </template>

      <template v-slot:item.StaffAddress="{ item }">
        <div>
          <div v-if="item.address1 != '' && item.address1 != null">
            <p>{{ item.address1 }}</p>
            <br />
          </div>
          <div v-if="item.address2 != '' && item.address2 != null">
            <p>{{ item.address2 }}</p>
            <br />
          </div>
          <div v-if="item.address3 != '' && item.address3 != null">
            <p>{{ item.address3 }}</p>
            <br />
          </div>
          <div v-if="item.address4 != '' && item.address4 != null">
            <p>{{ item.address4 }}</p>
            <br />
          </div>
        </div>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IOptions, IStaff } from "@/types";
import * as api from "@/services";
import _ from "lodash";
import ExcelExport from "@/mixins/excel-export";

@Component({
  components: {
    StaffForm: () => import("@/components/input/staff-form.vue"),
    FormatDate: () => import("@/components/datatable/format-date.vue"),
    EditButton: () => import("@/components/button/edit-button.vue"),
    PrintButton: () => import("@/components/button/print-button.vue"),
    RefreshButton: () => import("@/components/button/refresh-button.vue"),
    SearchTextField: () => import("@/components/input/search-text-field.vue"),
    DeleteDialog: () => import("@/components/dialog/delete-dialog.vue")
  },
  mixins: [ExcelExport]
})
export default class Staff extends Vue {
  // datatable settings
  private loading = false;
  private items = [];
  private item: any = {};
  private filter = "";
  private serverItemsLength: number = 0;

  // datatable options
  private options: IOptions = { sortBy: ["StaffCode"], sortDesc: [], itemsPerPage: 10 };

  // Mixins
  defaultFooterProps;
  setSortOptions: Function;
  processApiCall: Function;
  exportExcel: Function;
  fetchData: Function;
  saveRecord: Function;

  // edit options
  private dialog = false;
  private editedIndex = -1;
  editedItem = {} as IStaff;

  get formTitle() {
    return this.editedIndex === -1 ? this.$t("dialog-title-new-customer") : "Edit Item";
  }

  get headers() {
    return [
      { text: this.$t("StaffCode"), width: "8vw", divider: true, value: "StaffCode" },
      { text: this.$t("DepartmentCode"), width: "8vw", divider: true, value: "DepartmentCode" },
      { text: this.$t("StaffName"), width: "10vw", value: "StaffName", divider: true },
      { text: this.$t("PhoneNumber"), width: "8vw", value: "PhoneNumber", divider: true },
      { text: this.$t("email"), width: "8vw", value: "email", divider: true },
      { text: this.$t("StaffAddress"), width: "8vw", value: "StaffAddress", divider: true },
      { text: this.$t("StaffCountry"), width: "8vw", align: "center", value: "country", divider: true },
      { text: "Actions", align: "center", value: "Actions", width: "8vw", sortable: false }
    ];
  }

  private handleCancel() {
    this.closeDialog();
    this.refreshData();
  }

  private handleDelete(item) {
    this.processApiCall(item, api.deleteStaff, this.showLoading, this.refreshData);
  }

  private handleFilter(filterText: string) {
    this.filter = filterText;
    this.refreshData();
  }

  private handlePrint(obj: any) {
    this.exportExcel(api.exportPosStaff, this.showLoading, "staff.xlsx");
  }

  private handleRefresh() {
    this.refreshData();
  }

  private handleSave(item: any) {
    this.saveRecord(item, this.editedIndex, this.recordCreate, this.recordUpdate, this.closeDialog);
  }

  private handleUpdateOptions = opt => {
    const { page, itemsPerPage, sortBy, sortDesc } = opt;
    this.setSortOptions(this.options, sortBy, sortDesc);
    this.options.itemsPerPage = itemsPerPage;
    this.refreshData();
  };

  private closeDialog() {
    this.dialog = false;
    setTimeout(() => {
      this.editedItem = Object.assign({}, {} as IStaff);
      this.editedIndex = -1;
    }, 300);
  }

  private editItem(item) {
    this.editedIndex = this.items.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  private loadItems(response: any) {
    this.items = response.data;
    this.serverItemsLength = response.total;
  }

  private recordCreate(item: IStaff) {
    if (_.isEmpty(item)) {
      // Do something
    } else {
      this.processApiCall(item, api.addStaff, this.showLoading, this.refreshData);
    }
  }

  private recordUpdate(item: any) {
    this.processApiCall(item, api.editStaff, this.showLoading, this.refreshData);
  }

  private refreshData() {
    this.fetchData(this.options, this.filter, api.getStaff, this.loadItems, this.showLoading);
  }

  private showLoading(loading) {
    this.loading = loading;
  }
}
</script>
