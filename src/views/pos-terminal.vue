<template>
  <div class="mx-5">
    <!-- sidebar drawer -->
    <navigation-drawer></navigation-drawer>

    <!-- tab area -->
    <v-container>
      <v-layout wrap justify-center align-center fill-height>
        <v-flex xs12 sm10>
          <v-card>
            <v-tabs
              v-model="tabs"
              show-arrows
              grow
              color="secondary"
              background-color="transparent"
              slider-color="primary"
              @change="onTabChange"
            >
              <v-tabs-slider></v-tabs-slider>
              <v-tab v-for="n in tabLength" :key="n">
                <v-btn v-if="tabLength > 1" icon @click="onRemoveTab(n)">
                  <v-icon size="small">close</v-icon>
                </v-btn>
                {{ getCustomer(n) }}
              </v-tab>
            </v-tabs>
          </v-card>
        </v-flex>
        <v-flex xs12 sm2 text-center>
          <v-btn depressed class="text--secondary caption" small @click="onAddTab()">
            <v-icon left>add</v-icon> Add New
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- tabPage content -->
    <v-tabs-items v-model="tabs" class="my-3">
      <v-tab-item v-for="n in tabLength" :key="n">
        <!-- search bar -->
        <v-card flat style="border-radius: 0; display: flex; align-items: center;">
          <v-flex xs12>
            <v-text-field
              v-model="filterText"
              :placeholder="$t('placeholder-text-search')"
              clear-icon="clear"
              class="tfSearch"
              solo
              :flat="!isSearchbarHover && !isSearchbarFocus"
              small
              clearable
              hide-details
              prepend-inner-icon="search"
              @mouseover="isSearchbarHover = true"
              @mouseleave="isSearchbarHover = false"
              @focus="isSearchbarFocus = true"
              @blur="isSearchbarFocus = false"
              @keyup.enter="handleFilter"
              @click:prepend-inner="handleFilter"
              @click:clear="handleReset"
            ></v-text-field>
          </v-flex>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <!-- items -->
    <v-layout>
      <v-data-iterator
        hide-default-footer
        :footer-props="{
          itemsPerPageOptions,
          itemsPerPageText,
          showFirstLastPage,
          showCurrentPage
        }"
        :items="items"
        :items-per-page="itemsPerPage"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverItemsLength"
        @update:options="handleUpdateOptions"
      >
        <template v-slot:default="props">
          <v-layout justify-center wrap>
            <!-- <v-flex xs2
              v-for="(item, index) in props.items"
              :key="index"
              :item="item"
              @onButtonClick="clickAdd(item)"> -->
            <!-- TO BE DONE MAYBE  -->
            <product-card
              class="ma-2 pt-4"
              v-for="(item, index) in props.items"
              :key="index"
              :item="item"
              @onButtonClick="clickAdd(item)"
            ></product-card>
            <!-- </v-flex> -->
          </v-layout>
        </template>
      </v-data-iterator>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IOptions, ISession, ICartItem } from "@/types";
import { OrderModule } from "@/store/modules/order";
import * as api from "@/services";
import _ from "lodash";

@Component({
  components: {
    NavigationDrawer: () => import("@/components/layout/drawer.vue"),
    ProductCard: () => import("@/components/card/product-card.vue")
  }
})
export default class PosTerminals extends Vue {
  private filterText: string = "";
  private imageSource = require("@/assets/img/barcode.jpg");

  // searchbar
  private isSearchbarHover = false;
  private isSearchbarFocus = false;

  // data-iterator settings
  private loading = false;
  private items = [];
  private filter = "";
  private itemsPerPage: number = 1000;
  private serverItemsLength: number = 0;

  private options: IOptions = { sortBy: ["ProductCode"], sortDesc: [], itemsPerPage: 10000 };

  // footer options
  private itemsPerPageOptions = [6, 12, 18, 24, 30];
  private itemsPerPageText = "每頁顯示";
  private showCurrentPage = true;
  private showFirstLastPage = true;

  //tab feature
  private tabs = null;
  private tabLength = 1;

  private onAddTab() {
    OrderModule.AddSession();
    this.getSessions();
    OrderModule.EditCurrentTab(OrderModule.activeSessionIndex);
  }

  private onRemoveTab(tabNumber: number) {
    // ** tabNumber is one based
    // ** but the tabs variable is zero based
    OrderModule.RemoveSession(tabNumber);
    this.getSessions();
    OrderModule.EditCurrentTab(OrderModule.activeSessionIndex);
  }

  private getSessions() {
    // ** get the tab length from the backing variables in the store
    let sessions = OrderModule.allSessions;
    this.tabLength = sessions.length;
  }

  private onTabChange() {
    console.log("Aaaaaa");
    if (this.tabLength != 1) {
      OrderModule.SwitchSession(this.tabs);
      OrderModule.EditCurrentTab(this.tabs);
    } else {
      OrderModule.SwitchSession(this.tabs);
    }
  }

  private getCustomer(currentTab: number) {
    let customerCounter = OrderModule.getSessionId(currentTab);
    return "Customer-" + customerCounter;
  }

  private async fetchData(pageNo, pageSize: number, sort?: string, filter?: string) {
    this.loading = true;
    try {
      const response = await api.getPosProducts(pageNo, pageSize, sort, filter);
      this.items = response.data;

      this.serverItemsLength = response.total;
    } catch (e) {
      console.log("fetch pos terminal failed..", e);
    } finally {
      this.loading = false;
    }
  }

  private actionRefresh() {
    console.log("options" + JSON.stringify(this.options));
    let sortParams = _.zipWith(this.options.sortBy, this.options.sortDesc, function(by, isDesc) {
      return isDesc ? by + "|desc" : by;
    }).join(",");
    this.fetchData(this.options.page, this.options.itemsPerPage, sortParams, this.filter);
  }

  private clickAdd(item) {
    let tempItem: ICartItem = {
      ProductName: item.ProductName,
      ProductCode: item.ProductCode,
      Unit: item.ProductUnit,
      UnitPrice: item.UnitPrice,
      UnitPriceString: String(item.UnitPrice),
      Quantity: 1
    };
    OrderModule.AddToCurrentCart(tempItem);

    //let cart = OrderModule.getCurrentCartItems;
  }

  private handleFilter() {
    this.filter = this.filterText;
    this.actionRefresh();
  }

  private handleReset() {
    // ** clear the text in text input
    this.filterText = "";
    this.handleFilter();
  }

  private handleUpdateOptions(opt) {
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
      // console.log(JSON.stringify(this.options));
    }
    this.actionRefresh();
  }

  get refreshTrigger() {
    return OrderModule.getCartRefreshTrigger;
  }

  mounted() {
    this.getSessions();
    console.log("BBB");
    OrderModule.SET_ACTIVE_SESSION_INDEX(OrderModule.CurrentTab);
    OrderModule.SwitchSession(OrderModule.CurrentTab);
  }

  @Watch("refreshTrigger", { deep: true })
  private async onRefresh() {
    console.log("watch: refreshTrigger");
    this.getSessions();
  }

  @Watch("tabLength", { deep: true })
  private onTabCount() {
    console.log("watch: tabLength");
    this.tabs = OrderModule.activeSessionIndex;
  }
}
</script>
