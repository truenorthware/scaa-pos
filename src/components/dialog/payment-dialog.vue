<template>
  <v-dialog v-model="showDialog" scrollable width="606">
    <template v-slot:activator="{ on }">
      <v-btn
        depressed
        slot="activator"
        v-on="on"
        class="grey darken-2"
        outlined
        tile
        text
        style="flex: 2; border-radius: 0;"
        :disabled="buttonDisabled"
      >
        <div class="text-center white--text">
          <v-icon size="large" color="white">fas fa-money-bill-alt</v-icon>
          <h6 class="body-1 mt-1 font-weight-black">Payment</h6>
        </div>
      </v-btn>
    </template>

    <v-card>
      <v-card-text class="pa-0">
        <v-stepper v-model="step">
          <!-- stepper headers -->
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">Confirm Payment</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 2" step="2">Print Receipt</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <!-- confirm payment step -->
            <v-stepper-content step="1" class="pa-0 ma-0">
              <v-layout class="pa-0 ma-0">
                <v-flex xs4 class="pa-0 ma-0 pa-3">
                  <v-card-title>Payment</v-card-title>
                  <v-divider></v-divider>
                  <v-btn large block class="mt-3" :color="colorButtonPayment(1)" @click="clickPayByCash">
                    <v-icon left :color="colorIconPayment(1)">money</v-icon>Cash (HKD)
                  </v-btn>
                  <v-btn block large class="mt-3" :color="colorButtonPayment(2)" @click="clickPayByCredit">
                    <v-icon left :color="colorIconPayment(2)">credit_card</v-icon>Credit Card
                  </v-btn>

                  <v-container class="pa-0" v-if="selectedPaymentMethod == 2">
                    <v-radio-group v-model="cardType" class="pl-4 pr-4 pt-2">
                      <v-radio label="Visa" :value="1"></v-radio>
                      <v-radio label="Master" :value="2"></v-radio>
                      <v-radio label="AE" :value="3"></v-radio>
                      <v-radio label="Union Pay" :value="4"></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-flex>
                <v-flex xs8 class="pa-0 ma-0 grey darken-0">
                  <v-layout column wrap class="pa-0 ma-0">
                    <v-flex xs3 class="pa-0 pt-2 pb-4 ma-0 grey darken-1">
                      <h1 class="pl-4 pr-4 pb-2" style="font-size: 36px; color: white">
                        <span class="caption">Due:</span>
                        <br />
                        <br />
                        ${{ totalAmount }}
                      </h1>
                      <v-container class="pa-0" style="height: 230px !important;" v-if="selectedPaymentMethod == 1">
                        <h1 class="pl-4 pr-4 pb-2" style="font-size: 36px; color: white;">
                          <span class="caption">Tendered:</span>
                          <br />
                          <input
                            type="text"
                            id="money_input"
                            ref="inputTendered"
                            v-model="tenderedAmount"
                            @keyup="checkfirstzero"
                            @keypress="validate"
                          />
                        </h1>
                        <v-divider class="mt-4" />
                        <h1
                          class="pl-4 pr-4 pb-2"
                          :style="`font-size: 36px; color: ${changeAmount >= 0 ? '#00E676' : '#FF3D00'};`"
                        >
                          <span class="caption">Change:</span>
                          <br />
                          <br />
                          ${{ changeAmount }}
                        </h1>
                      </v-container>
                      <v-container class="pa-0" style="height: 230px !important;" v-if="selectedPaymentMethod == 2">
                      </v-container>
                    </v-flex>
                    <v-flex
                      xs7
                      child-flex
                      class="pa-0 ma-0 indigo lighten-1"
                      style="display: grid !important; grid-template-columns: 189px 1fr;"
                    >
                      <numeric-buttons @click="handleNumClick" c_value="C"></numeric-buttons>

                      <v-layout column class="pa-0 ma-0">
                        <v-flex xs3 class="pa-0 ma-0 indigo lighten-1">
                          <numeric-button value="+10" @click="handleNumClick(10)"></numeric-button>
                          <v-btn class="indigo lighten-1 white--text" tile text style="flex: 1; border-radius: 0;">
                            <v-icon size="small" color="white" class="mr-2">fas fa-user</v-icon>Customers
                          </v-btn>
                        </v-flex>
                        <v-flex xs3 class="pa-0 ma-0 indigo darken-1">
                          <numeric-button value="+20" @click="handleNumClick(20)"></numeric-button>
                          <v-btn
                            class="indigo darken-1 white--text"
                            tile
                            text
                            style="flex: 1; border-radius: 0;"
                            @click="doValidate"
                            :disabled="enableValidate"
                            :loading="isLoading"
                          >
                            <v-icon size="small" color="white" class="mr-2">fas fa-check</v-icon>Validate
                          </v-btn>
                        </v-flex>
                        <v-flex xs3 class="pa-0 ma-0">
                          <numeric-button value="+50" @click="handleNumClick(50)"></numeric-button>
                        </v-flex>
                        <v-flex xs3 class="pa-0 ma-0">
                          <v-btn
                            text
                            class="subtitle-2 grey darken-1 white--text"
                            style="border-radius: 0; height: 60px;"
                            @click="clickTenderedAmount"
                          >
                            <v-icon size="large" color="white">fas fa-backspace</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-stepper-content>
            <!-- print receipt step -->
            <v-stepper-content step="2" class="pa-0 ma-0">
              <report-layout :invoiceItem="invoiceItem" :selectedPaymentMethod="selectedPaymentMethod" />
              <!-- :changeAmount="changeAmount"
                :tenderedAmount="tenderedAmount"
              :totalAmount="selectedPaymentMethod"-->
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="grey darken-1" text @click="handleClose">{{ btnTextClose }}</v-btn>
      </v-card-actions>
    </v-card>
    <iframe
      ref="printFrame"
      id="printFrame"
      style="display: block; position: absolute; opacity:1; z-index:-99;"
    ></iframe>
  </v-dialog>
</template>

<script lang="ts">
const name = "payment-dialog";

import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import AutoNumeric from "autonumeric";
import { ICustomer, Mode, IInvoice, IInvoiceRequest, IInvoiceResponse, ICartItem } from "@/types";
import { OrderModule } from "@/store/modules/order";
import * as api from "@/services";

import moment from "moment";

@Component({
  components: {
    NumericButtons: () => import("@/components/button/drawer-numerics-button.vue"),
    NumericButton: () => import("@/components/button/numeric-button.vue"),
    ReportLayout: () => import("@/components/layout/report-layout.vue")
  }
})
export default class PaymentDialog extends Vue {
  private showDialog = false;
  private loading = false;

  private step = 1;

  private bSetAutoNumeric = false;
  private selectedPaymentMethod = 1;
  private tenderedAmount = "0";
  private changeAmount = 0;
  private cardType = 1;
  private needCent = false;
  private isLoading = false;
  private invoiceItem: IInvoiceResponse = null;

  get enableValidate() {
    let disableValidate = true;

    if (this.selectedPaymentMethod === 0) {
      disableValidate = false;
    } else if (this.selectedPaymentMethod === 1) {
      let diff = parseFloat(this.tenderedAmount) - this.totalAmount;
      disableValidate = Boolean(diff < 0);
    } else if (this.selectedPaymentMethod == 2) {
      disableValidate = false;
    }

    return disableValidate;
  }

  checkfirstzero(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);

    const el: any = this.$refs.inputTendered;
    if (el == null) return;

    var reg1 = /[0-9]/;
    let pos = el.selectionStart;
    if (this.tenderedAmount[0] == "0" && this.tenderedAmount[1] != "." && reg1.test(key)) {
      this.tenderedAmount = this.tenderedAmount[1];
      this.setCursorPos(1);
    }
  }

  validate(evt) {
    console.log("keypress");
    var theEvent = evt || window.event;
    {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }

    const el: any = this.$refs.inputTendered;
    if (el == null) return;

    let dotcount = (this.tenderedAmount.match(/\./g) || []).length;
    console.log("dotcount", dotcount);
    var regex = /[0-9]|\./;
    if (!regex.test(key) || (dotcount > 0 && key == ".")) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        console.log("test false", theEvent.preventDefault);
        theEvent.preventDefault();
      }
    }
  }

  // computed properties
  get btnTextClose() {
    return this.step === 1 ? "Close" : "Next order";
  }

  get buttonDisabled() {
    return this.cartItems.length == 0;
  }

  get cartItems(): ICartItem[] {
    // console.log("@@@", JSON.parse(JSON.stringify(item)));
    return OrderModule.getCurrentCartItems;
  }

  // get changeAmount() {
  //   return Math.max(this.tenderedAmount - this.totalAmount, 0);
  // }

  get totalAmount(): number {
    let total: number = 0;
    OrderModule.getCurrentCartItems.forEach((item: ICartItem) => {
      total += item.UnitPrice * item.Quantity;
    });
    return total;
  }

  colorButtonPayment(n: number) {
    return this.selectedPaymentMethod === n ? "secondary" : "default";
  }

  colorIconPayment(n: number) {
    return this.selectedPaymentMethod === n ? "white" : "default";
  }

  private async createInvoice(obj: any) {
    this.loading = true;
    try {
      let response = await (api.createInvoice(obj) as any);

      let r1 = response as IInvoiceResponse;
      this.invoiceItem = r1;

      if (r1.InvoiceNumber) {
        if (r1.InvoiceNumber > 0) {
          // let currentSession = OrderModule.activeSessionIndex;
          let currentTab = OrderModule.activeSessionIndex + 1;
          OrderModule.RemoveSession(currentTab);
          OrderModule.TOGGLE_CART_REFRESH();
        }
      }
      this.step = 2;
    } catch (e) {
      confirm("Problem creatig invoice");
      console.log("create invoice failed..", e);
    } finally {
      this.isLoading = false;
    }
  }

  private clickPayByCash() {
    this.selectedPaymentMethod = 1;
    this.tenderedAmount = "0";
  }

  private clickPayByCredit() {
    this.selectedPaymentMethod = 2;
    this.tenderedAmount = "0";
    this.cardType = 1;
  }

  private clickTenderedAmount() {
    this.insertText("", true);
  }

  private doValidate() {
    if (this.selectedPaymentMethod == 2) {
      this.tenderedAmount = this.totalAmount.toString();
    }
    // confirm(JSON.stringify(this.cartItems));
    if (parseFloat(this.tenderedAmount) < this.totalAmount) {
      return;
    }
    let request: IInvoiceRequest = {
      StaffCode: "POS",
      PaymentMethod: this.selectedPaymentMethod,
      PaymentAmount: parseFloat(this.tenderedAmount),
      CartItems: this.cartItems
    };

    this.createInvoice(request);
  }

  private handleClose() {
    this.showDialog = false;
    if (this.step == 2) this.selectedPaymentMethod = 1;
    this.step = 1;
    this.tenderedAmount = "0";
  }

  handleNumClick(num: number) {
    const el: any = this.$refs.inputTendered;
    if (this.selectedPaymentMethod === 1) {
      if (num === -1) {
        this.insertText("", false);
      } else if (num == 0.1) {
        this.insertText(".", false);
      } else if (num < 10) {
        this.insertText(num.toString(), false);
      } else {
        this.tenderedAmount = (parseFloat(this.tenderedAmount) + num).toString();
        if (el) {
          let pos = this.tenderedAmount.length;
          this.setCursorPos(pos);
        }
      }
    }
    if (this.needCent) {
      this.needCent = false;
    }
  }
  insertText(text, bBack) {
    const el: any = this.$refs.inputTendered;
    if (el == null) {
      return;
    }
    var scrollPos = el.scrollTop;
    var pos = 0;
    pos = el.selectionStart;

    if (bBack) {
      let back = this.tenderedAmount.substring(pos, this.tenderedAmount.length);
      pos = Math.max(pos - 1, 0);
      let front = this.tenderedAmount.substring(0, pos);
      this.tenderedAmount = front + text + back;
      console.log("input.value", this.tenderedAmount);
    } else if (text == "") {
      this.tenderedAmount = "0";
      pos = 1;
    } else {
      let front = this.tenderedAmount.substring(0, pos);
      let back = this.tenderedAmount.substring(pos, this.tenderedAmount.length);
      if (front === "0" && text != ".") front = "";
      this.tenderedAmount = front + text + back;
      pos = pos + text.length;
    }

    this.setCursorPos(pos);
  }

  setCursorPos(pos) {
    const el: any = this.$refs.inputTendered;
    if (el) {
      this.$nextTick(() => {
        el.selectionStart = pos;
        el.selectionEnd = pos;
        el.focus();
      });
    }
  }

  @Watch("tenderedAmount")
  onTenderedAmount() {
    if (this.tenderedAmount == "") {
      this.tenderedAmount = "0";
      this.setCursorPos(1);
    }
    this.changeAmount = Math.max(parseFloat(this.tenderedAmount) - this.totalAmount, 0);
  }

  @Watch("cardType")
  onCardType() {
    console.log(this.cardType);
  }
}
</script>
