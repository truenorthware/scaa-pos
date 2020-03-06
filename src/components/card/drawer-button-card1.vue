<template>
  <v-card class="mx-auto pa-0" color="grey darken-1" :tile="true">
    <!-- Container -->
    <v-container fluid grid-list-sm class="orange pa-1 pb-2 pt-2">
      <v-layout
        row
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
        <v-flex d-flex xs4>
          <v-layout column class="pa-0 ma-0">
            <customer-select-dialog></customer-select-dialog>

            <v-btn
              class="indigo darken-2 payment-btn"
              outlined
              tile
              text
              style="flex: 2; border-radius: 0;"
              @click="onButtonClick($event, 10007)"
            >
              <div
                class="text-xs-center"
                style="height: 100%; justify-content: center; display: flex; flex-direction: column;"
              >
                <v-icon size="large" color="white">fas fa-money-bill-alt</v-icon>
                <h6 class="subtitle-2 white--text mt-1">Payment</h6>
              </div>
            </v-btn>
          </v-layout>
        </v-flex>
        <!-- seondary column -->
        <v-flex d-flex xs6 child-flex>
          <v-layout column class="pa-0 ma-0">
            <v-card tile dark color="green darken-3">
              <!-- <v-card-text>I'm a Flex that will grow and shrink (default behavior)</v-card-text> -->
              <v-item-group v-model="toggle_exclusive">
                <v-container grid-list-xs>
                  <v-layout wrap>
                    <v-flex v-for="n in 3" :key="n" xs4>
                      <v-item v-slot:default="{ active, toggle }">
                        <v-card
                          :color="active ? 'primary' : ''"
                          class="d-flex align-center"
                          dark
                          height="200"
                          @click="toggle"
                        >
                          <v-scroll-y-transition>
                            <div v-if="active" class="display-3 text-xs-center">
                              Active
                            </div>
                          </v-scroll-y-transition>
                        </v-card>
                      </v-item>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-item-group>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex d-flex child-flex>
          <v-card dark color="green darken-3">
            <v-card-text>I'm a Flex that will grow and shrink (default behavior)</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component({
  components: {
    NumericButton: () => import("@/components/button/numeric-button.vue"),
    CustomerSelectDialog: () => import("@/components/dialog/customer-select-dialog.vue")
  }
})
export default class DrawBottomCard extends Vue {
  private name = "listing-card";
  private toggle_exclusive = 1;
  // toggle_exclusive: undefined;

  toggle_none = null;
  alignment = -1;
  formatting = [];
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  letters = "qwertyuiop".split("");
  toggle_1 = null;
  toggle_2 = null;
  toggle_3 = null;
  toggle_4 = null;

  private currentMode = -1;

  selected = [];

  lorem = `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`;

  get newTitle() {
    return " Restaurant and";
  }

  onButtonClick(e, val) {
    switch (val) {
      case 10001:
        this.currentMode = 1;
        break;
      case 10002:
        this.currentMode = 2;
        break;
      case 10003:
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
  border: 1px solid #f0eef0 !important;
  border-left: none !important;
  min-width: 63px !important;
}
.border-bottom {
  border-bottom: none !important;
}
.toggle {
  display: grid;
  margin-left: -2px;
}

.v-btn.v-btn {
  border-color: #f0eef0 !important;
  border-left: none !important;
}
</style>
