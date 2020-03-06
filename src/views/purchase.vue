<template>
  <div>
    <!-- tab area -->
    <purchase-drawer :items="cartItems"></purchase-drawer>

    <!-- items -->
    <v-container fluid grid-list-md>
      <v-data-iterator
        hide-default-footer
        :items="items"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverItemsLength"
        @update:options="handleUpdateOptions"
      >
        <template v-slot:default="props">
          <v-layout align-start justify-start fill-height wrap>
            <product-card
              v-for="(item, index) in props.items"
              class="ma-1 pt-3"
              :key="index"
              :item="item"
              @onButtonClick="handleAddToCart(item)"
            ></product-card>
          </v-layout>
        </template>

        <!-- Header Slot -->
        <template v-slot:header>
          <v-toolbar text color="grey lighten-2" elevation="0">
            <search-text-field @onFilter="handleFilter"></search-text-field>
            <v-spacer class="hidden-xs-only"></v-spacer>
            <refresh-button @click="handleRefresh"> </refresh-button>
          </v-toolbar>
        </template>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Mixins } from "vue-property-decorator";
import { IOptions, ICartItem, IProduct } from "@/types";
import * as api from "@/services";
import ExcelExport from "@/mixins/excel-export";

@Component({
  components: {
    PurchaseDrawer: () => import("@/components/layout/purchase-drawer.vue"),
    ProductCard: () => import("@/components/card/product-card.vue"),
    RefreshButton: () => import("@/components/button/refresh-button.vue"),
    SearchTextField: () => import("@/components/input/search-text-field.vue")
  },
  mixins: [ExcelExport]
})
export default class Purchase extends Vue {
  // datatable settings
  private loading = false;
  private items = [];
  private item: any = {};
  private filter = "";
  private serverItemsLength: number = 0;

  // datatable options
  private options: IOptions = { sortBy: ["ProductCode"], sortDesc: [], itemsPerPage: -1 };

  private imageSource = require("@/assets/img/barcode.jpg");

  // Mixins
  defaultFooterProps;
  setSortOptions: Function;
  processApiCall: Function;
  exportExcel: Function;
  fetchData: Function;
  saveRecord: Function;

  private cartItems: ICartItem[] = [];

  private handleAddToCart(item: IProduct) {
    const productCode = item.ProductCode;
    const idx = this.cartItems.findIndex(k => k.ProductCode == productCode);

    if (idx == -1) {
      const cartItem = {
        ProductCode: item.ProductCode,
        ProductName: item.ProductName,
        Unit: item.ProductUnit,
        Quantity: 1,
        UnitPrice: item.UnitPrice,
        UnitPriceString: item.UnitPrice.toString()
      };
      this.cartItems.push(cartItem);
    } else {
      this.cartItems[idx].Quantity += 1;
    }

    // confirm(idx.toString());
    // confirm(JSON.stringify(item));
  }

  private handleFilter(filterText: string) {
    this.filter = filterText;
    this.refreshData();
  }

  private handleRefresh() {
    this.refreshData();
  }

  private handleUpdateOptions = opt => {
    const { page, itemsPerPage, sortBy, sortDesc } = opt;
    this.setSortOptions(this.options, sortBy, sortDesc);
    this.options.itemsPerPage = itemsPerPage;
    this.refreshData();
  };

  private loadItems(response: any) {
    this.items = response.data;
    this.serverItemsLength = response.total;
  }

  private refreshData() {
    this.fetchData(this.options, this.filter, api.getPosProducts, this.loadItems, this.showLoading);
  }

  private showLoading(loading) {
    this.loading = loading;
  }
}
</script>
