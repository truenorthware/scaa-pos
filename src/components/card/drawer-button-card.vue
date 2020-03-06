<template>
  <v-card class="mx-auto pa-0" color="grey darken-1" :tile="true">
    <!-- Container -->
    <v-container fluid grid-list-sm class="pa-0 white">
      <v-layout
        wrap
        @keyup.49="onButtonClick($event, 1)"
        @keyup.50="onButtonClick($event, 2)"
        @keyup.51="onButtonClick($event, 3)"
        @keyup.52="onButtonClick($event, 4)"
        @keyup.53="onButtonClick($event, 5)"
        @keyup.54="onButtonClick($event, 6)"
        @keyup.55="onButtonClick($event, 7)"
        @keyup.56="onButtonClick($event, 8)"
        @keyup.57="onButtonClick($event, 9)"
        @keyup.48="onButtonClick($event, 0)"
        @keyup.8="onButtonClick($event, 10004)"
        @keyup.190="onButtonClick($event, 0.1)"
        @keyup.110="onButtonClick($event, 0.1)"
      >
        <!-- first column -->
        <v-flex d-flex xs5 child-flex class="pa-0 ma-0">
          <v-layout column class="pa-0 ma-0">
            <customer-select-dialog></customer-select-dialog>
            <payment-dialog></payment-dialog>
          </v-layout>
        </v-flex>
        <!-- seondary column -->
        <v-flex d-flex xs7 child-flex class="pa-0 ma-0">
          <numeric-buttons @click="onButtonClick"></numeric-buttons>
          <v-layout column class="pa-0 ma-0">
            <!-- <v-flex column xs12 sm6> -->
            <v-btn-toggle class="toggle pa-0 ma-0" v-model="toggle_exclusive" mandatory>
              <v-btn
                text
                :class="
                  `subtitle-2 white--text group-btn border-bottom ${currentMode === 1 ? 'secondary' : 'grey darken-1'}`
                "
                type="radio"
                style="border-radius: 0; height: 60px; border: 0;"
                @click="onButtonClick($event, 10001)"
                >Qty</v-btn
              >
              <v-btn
                text
                :class="
                  `subtitle-2 white--text group-btn border-bottom ${currentMode === 2 ? 'secondary' : 'grey darken-1'}`
                "
                style="border-radius: 0; height: 60px; border-right: 0"
                @click="onButtonClick($event, 10002)"
                >Disc</v-btn
              >
              <v-btn
                text
                :class="
                  `subtitle-2 white--text group-btn border-bottom ${currentMode === 3 ? 'secondary' : 'grey darken-1'}`
                "
                style="border-radius: 0; height: 60px; border-right: 0; border-bottom: 1px solid white !important"
                @click="onButtonClick($event, 10003)"
                >Price</v-btn
              >
            </v-btn-toggle>
            <!-- </v-flex> -->
            <!-- @click="onButtonClick($event, 10004)" -->
            <v-btn
              text
              class="subtitle-2 grey darken-1 white--text numeric-btn"
              style="border-radius: 0; height: 60px;"
              @click="onButtonClick($event, -2)"
            >
              <v-icon size="large" color="white">fas fa-backspace</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { ButtonEvent } from "@/types";

@Component({
  components: {
    NumericButtons: () => import("@/components/button/drawer-numerics-button.vue"),
    CustomerSelectDialog: () => import("@/components/dialog/customer-select-dialog.vue"),
    PaymentDialog: () => import("@/components/dialog/payment-dialog.vue")
  }
})
export default class DrawBottomCard extends Vue {
  // private name = "listing-card";
  private toggle_exclusive = 0;

  private currentMode = -1;

  selected = [];

  onButtonClick(e, val) {
    switch (val) {
      case 10001:
        console.log("from drawer card 1001");
        this.currentMode = 1;
        break;
      case 10002:
        console.log("from drawer card 1002");
        this.currentMode = 2;
        break;
      case 10003:
        console.log("from drawer card 1003");
        this.currentMode = 3;
        break;
    }

    if (val <= 9) {
      // numeric button
      this.onClick(e, val);
    } else if (val === 10006) {
      this.onCustomerButtonClick(e, val);
    } else {
      this.onFnButtonClick(e, val);
    }
  }

  @Emit("onButtonClick")
  onClick(e, val) {
    return;
  }

  @Emit("onFnButtonClick")
  onFnButtonClick(e, val) {
    console.log("from drawer onFnButtonClick");
    return;
  }

  @Emit("onCustomerButtonClick")
  onCustomerButtonClick(e, val) {
    return;
  }
}
</script>

<style scoped>
.payment-btn {
  border-color: #f0eef0 !important;
}
.numeric-btn {
  border-left: none !important;
}
.border-bottom {
  border-bottom: none !important;
}
.toggle {
  display: grid;
  margin-left: -2px;
}
.theme--light.v-btn-toggle .v-btn.v-btn {
  border-color: #f0eef0 !important;
  border-left: none !important;
}
</style>
