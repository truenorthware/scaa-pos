<template>
  <v-navigation-drawer class="white" width="450" light app>
    <!-- *********************** -->
    <!-- app title and user icon -->
    <!-- *********************** -->
    <template v-slot:prepend>
      <v-toolbar flat class="indigo darken-5 white--text">
        <v-toolbar-title>{{ $t("appTitle") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <cashier-dialog></cashier-dialog>
        </v-toolbar-items>
      </v-toolbar>
    </template>

    <!-- ********************** -->
    <!-- Shopping cart contents -->
    <!-- ********************** -->
    <template v-if="cartItemsCount == 0">
      <empty-cart-background-card :title="$t('cartIsEmpty')"></empty-cart-background-card>
    </template>
    <!-- Some item in the shopping cart -->
    <template v-else>
      <div ref="listCartItems" style="height: 100%; overflow-y:scroll; overflow-x: hidden;">
        <v-list shaped>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              v-for="(item, index) in cartItems"
              :key="index"
              two-line
              @contextmenu.prevent="$refs.menuCartItem.open($event, index)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.ProductName"></v-list-item-title>
                <v-list-item-subtitle>
                  Qty.: {{ item.Quantity }}, Unit Price: ${{ item.UnitPriceString }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <h3>${{ item.UnitPrice * item.Quantity }}</h3>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <vue-context ref="menuCartItem">
          <template slot-scope="child">
            <li>
              <a href="#" @click.prevent="handleRemoveItem($event, child.data)">Delete</a>
            </li>
          </template>
        </vue-context>
      </div>
    </template>

    <!-- ************** -->
    <!-- Bottom buttons -->
    <!-- ************** -->
    <template v-slot:append>
      <v-divider></v-divider>
      <v-card flat tile>
        <v-card-title class="justify-space-between">
          <span class="caption grey--text">Total: </span>
          <span class="display-1 font-weight-black"><span class="headline">$</span>{{ totalAmount }}</span>
        </v-card-title>
      </v-card>
      <drawer-button-card @onButtonClick="handleCalcClick" @onFnButtonClick="handleCalcClick"></drawer-button-card>
      <!-- @onCustomerButtonClick="customerListVisible = true" -->
    </template>

    <!-- dialogs -->
    <!-- <payment-dialog :show-dialog.sync="showPaymentDialog"></payment-dialog> -->
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";
import { ButtonEvent, Mode, OrderCartItem, ICartItem } from "@/types";
import { OrderModule } from "@/store/modules/order";
import { VueContext } from "vue-context";

@Component({
  components: {
    VueContext,
    DrawerButtonCard: () => import("@/components/card/drawer-button-card.vue"),
    EmptyCartBackgroundCard: () => import("@/components/card/empty-cart-background-card.vue"),
    NumericButton: () => import("@/components/button/numeric-button.vue"),
    CashierDialog: () => import("@/components/dialog/cashier-dialog.vue")
    // PaymentDialog: () => import("@/components/dialog/payment-dialog.vue")
  }
})
export default class Drawer extends Vue {
  // properties
  private item = 0;
  private index = 0;
  private selectedItem = -1;

  // showing the dialogs
  // private customerListVisible = false;
  private showPaymentDialog = false;

  // calculation
  private calcMode = 0;
  private needReset = false;
  private needCent = false;

  // computed properties
  get cartItems(): ICartItem[] {
    let item = OrderModule.getCurrentCartItems;
    console.log("getCartItem");
    console.log("cartItems()", JSON.stringify(item));
    console.log("index = " + this.index);
    return item;
  }

  // * Need this to diable the items
  get cartItemsCount(): number {
    return OrderModule.currentCartItems.length;
  }

  // ** Total Amount of the drawer
  get totalAmount(): number {
    let total: number = 0;

    OrderModule.getCurrentCartItems.forEach((item: ICartItem) => {
      total += item.UnitPrice * item.Quantity;
    });
    return total;
  }

  // private mounted() {
  // }

  // ** Delete one item from current cart
  private handleRemoveItem(e, index) {
    OrderModule.RemoveCartItem(index);
  }

  //  handleCalcClick = (e, val) => {
  handleCalcClick(e, val) {
    console.log("Drawer - handleCalcClick");
    console.log("Drawer - val" + JSON.stringify(val));
    // if (val === 10006) {
    //   this.customerListVisible = true;
    //   console.log("click 10006");
    //   return;
    // }
    if (val === 10007) {
      this.showPaymentDialog = true;
      return;
    }

    switch (val) {
      case ButtonEvent.QTY:
        console.log("QTY mode button pressed");
        this.calcMode = Mode.QTY;
        this.needReset = true;
        break;
      // case 10002:
      case ButtonEvent.DISC:
        console.log("DISC mode button pressed");
        this.calcMode = Mode.DISC;
        this.needReset = true;
        break;
      // case 10003:
      case ButtonEvent.PRICE:
        console.log("PRICE mode button pressed");
        this.calcMode = Mode.PRICE;
        this.needReset = true;
        break;
      // case 10004:
      case ButtonEvent.BACKSPACE:
        console.log("BACKSPACE button pressed");
        this.needReset = true;
        break;
      default:
        this.calcMode === Mode.NULL;
        break;
    }

    if (this.calcMode === Mode.NULL || val > 9) {
      return;
    }

    switch (this.calcMode) {
      case Mode.QTY:
        this.doChangeQuantity(val);
        break;
      case Mode.PRICE:
        this.doChangePrice(val);
        break;
      default:
        break;
    }

    this.needReset = false;
  }

  private doChangeQuantity(val) {
    console.log("inside doChangeQuantity");
    if (val == 0.1) {
      // *** This block is left empty by purpose
    } else if (val >= 0 && val < 10) {
      let selectItem = OrderModule.currentCartItems[OrderModule.selectIndex];
      let newQty = selectItem.Quantity + String(val);
      selectItem.Quantity = parseInt(newQty);
      OrderModule.ReplaceCurrentCartItem(selectItem);
    }
    // * Press the Backspace
    else if (val == ButtonEvent.BACKSPACE) {
      let selectItem = OrderModule.currentCartItems[OrderModule.selectIndex];
      selectItem.Quantity = 0;
      OrderModule.ReplaceCurrentCartItem(selectItem);
    }
    // * Toggle +/-
    else if (val == -1) {
      let selectItem = OrderModule.currentCartItems[OrderModule.selectIndex];
      let newQty = selectItem.Quantity * -1;
      selectItem.Quantity = newQty;
      OrderModule.ReplaceCurrentCartItem(selectItem);
    }
  }

  private doChangePrice(val) {
    console.log("inside doChangePrice");
    // * Press the decimal point
    if (val == 0.1) {
      let selectItem = OrderModule.currentCartItems[OrderModule.selectIndex];

      let trimString = selectItem.UnitPriceString.trim();
      let newPriceString = trimString.indexOf(".") == -1 ? trimString + "." : trimString;
      selectItem.UnitPriceString = newPriceString;
      selectItem.UnitPrice = parseFloat(newPriceString);

      OrderModule.ReplaceCurrentCartItem(selectItem);
    } else if (val >= 0 && val < 10) {
      let selectItem = OrderModule.currentCartItems[OrderModule.selectIndex];

      let newString = selectItem.UnitPriceString.trim();
      let newPriceString = newString == "0" ? String(val) : newString + String(val);

      selectItem.UnitPrice = parseFloat(newPriceString);
      selectItem.UnitPriceString = newPriceString;
      OrderModule.ReplaceCurrentCartItem(selectItem);
    }
    // * Press the Backspace
    else if (val == ButtonEvent.BACKSPACE) {
      let selectItem = OrderModule.currentCartItems[OrderModule.selectIndex];
      selectItem.UnitPrice = 0;
      selectItem.UnitPriceString = String(0);
      OrderModule.ReplaceCurrentCartItem(selectItem);
    }
    // * Toggle +/-
    else if (val == -1) {
      let selectItem = OrderModule.currentCartItems[OrderModule.selectIndex];
      let newPrice = selectItem.UnitPrice * -1;

      let newPriceString =
        String(Math.sign(newPrice)).slice(0, -1) + selectItem.UnitPriceString.trim().replace("-", "");

      selectItem.UnitPrice = newPrice;
      selectItem.UnitPriceString = newPriceString;
      OrderModule.ReplaceCurrentCartItem(selectItem);
    }
  }

  @Watch("cartItemsCount", { deep: true })
  private async onOrderChange() {
    this.item = Math.max(this.cartItemsCount - 1, 0);
    console.log("watch - option - cartsize");
    console.log(JSON.stringify(this.cartItems));

    // TODO: change the event to remove settimeout
    let container: any = this.$refs.listCartItems;
    if (container) {
      setTimeout(() => {
        container.scrollTo({
          left: 0,
          top: container.scrollHeight,
          behavior: "smooth"
        });
      }, 50);
    }
  }

  @Watch("selectedItem")
  onSelectedItemChanged() {
    console.log("edit onSelectedItemChanged");
    OrderModule.editSelectIndex(this.selectedItem);
  }
}
</script>
