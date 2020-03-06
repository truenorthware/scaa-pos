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
            <product-form :item="editedItem" :title="formTitle" @onSave="handleSave" @onCancel="handleCancel" />
          </v-dialog>

          <print-button @click="handlePrint"> </print-button>
          <refresh-button @click="handleRefresh"> </refresh-button>
        </v-toolbar>
      </template>

      <!-- Action Slot -->
      <template v-slot:item.Actions="{ item }">
        <edit-button @click="editItem(item)"> </edit-button>
        <delete-dialog :item="editedItem" :title="$t('dt-delete-product')" @onDelete="handleDelete" />
      </template>

      <template v-slot:item.ImageId="{ item }">
        <product-image-dialog :item="item" :on-save="handleSaveImage" />
      </template>

      <template v-slot:item.DateTimeModified="{ item }">
        <format-date :dateStr="item.DateTimeModified"></format-date>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IOptions, IProduct } from "@/types";
import * as api from "@/services";
import _ from "lodash";
import ExcelExport from "@/mixins/excel-export";

@Component({
  components: {
    ProductForm: () => import("@/components/input/product-form.vue"),
    FormatDate: () => import("@/components/datatable/format-date.vue"),
    EditButton: () => import("@/components/button/edit-button.vue"),
    PrintButton: () => import("@/components/button/print-button.vue"),
    RefreshButton: () => import("@/components/button/refresh-button.vue"),
    SearchTextField: () => import("@/components/input/search-text-field.vue"),
    DeleteDialog: () => import("@/components/dialog/delete-dialog.vue"),
    ProductImageDialog: () => import("@/components/dialog/product-image-dialog.vue")
  },
  mixins: [ExcelExport]
})
export default class Product extends Vue {
  // datatable settings
  private loading = false;
  private items = [];
  private item: any = {};
  private filter = "";
  private serverItemsLength: number = 0;

  // datatable options
  private options: IOptions = { sortBy: ["ProductCode"], sortDesc: [], itemsPerPage: 10 };

  // Mixins
  defaultFooterProps;
  setSortOptions: Function;
  processApiCall: Function;
  exportExcel: Function;
  fetchData: Function;
  saveRecord: Function;
  saveImage: Function;

  // edit options
  private dialog = false;
  private editedIndex = -1;
  private editedItem = {} as IProduct;

  // other
  private imageVersion = 0;

  get formTitle() {
    return this.editedIndex === -1 ? this.$t("dialog-title-new-product") : "Edit Item";
  }

  get headers() {
    return [
      { text: this.$t("ProductCode"), width: "10vw", value: "ProductCode" },
      { text: "", width: "0px", divider: true, value: "ImageId", sortable: false },
      { text: this.$t("ProductName"), divider: true, value: "ProductName" },
      { text: this.$t("ProductCategory"), width: "10vw", divider: true, value: "ProductCategory" },
      { text: this.$t("ProductUnit"), width: "8vw", align: "right", divider: true, value: "ProductUnit" },
      { text: "UnitPrice", width: "8vw", divider: true, align: "right", value: "UnitPrice" },
      { text: "Modified", value: "DateTimeModified", width: "8vw", divider: true },
      { text: "Actions", align: "center", value: "Actions", width: "8vw", sortable: false }
    ];
  }

  private handleCancel() {
    this.closeDialog();
    this.refreshData();
  }

  private handleDelete(item) {
    this.processApiCall(item, api.deleteProducts, this.showLoading, this.refreshData);
  }

  private handleFilter(filterText: string) {
    this.filter = filterText;
    this.refreshData();
  }

  private handlePrint(obj: any) {
    this.exportExcel(api.exportPosProduct, this.showLoading, "products.xlsx");
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
      this.editedItem = Object.assign({}, {} as IProduct);
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
    this.items.forEach(e => {
      e.ImageVersion = this.imageVersion;
    });
    this.serverItemsLength = response.total;
  }

  private reloadImage(response: any, item: IProduct) {
    this.imageVersion = (this.imageVersion + 1) % 10;
    item.ImageVersion = this.imageVersion;
    item.ImageId = response.Id;
  }

  private recordCreate(item: IProduct) {
    if (_.isEmpty(item)) {
      // Do something
    } else {
      this.processApiCall(item, api.addProducts, this.showLoading, this.refreshData);
    }
  }

  private recordUpdate(item: any) {
    this.processApiCall(item, api.editProducts, this.showLoading, this.refreshData);
  }

  private refreshData() {
    this.fetchData(this.options, this.filter, api.getPosProducts, this.loadItems, this.showLoading);
  }

  private showLoading(loading) {
    this.loading = loading;
  }

  private handleSaveImage(item: IProduct, file: File) {
    this.saveImage(item, file, api.uploadProductImage, this.reloadImage, this.showLoading);
  }
}
</script>
