<template>
  <v-navigation-drawer clipped class="white" width="600" light app>
    <!-- *********************** -->
    <!-- app title and user icon -->
    <!-- *********************** -->
    <template v-slot:prepend>
      <v-card flat tile height="100">
        <v-card-title class="justify-end grey--text">Total: {{ totalAmount }}</v-card-title>
      </v-card>
    </template>
    <!-- ********************** -->
    <!-- Purchaser cart contents -->
    <!-- ********************** -->
    <v-flex xs12 ref="listCartItems" style="height: 100%; overflow-y:scroll; overflow-x: hidden;">
      <v-data-table
        class="elevation-1"
        hide-default-header
        hide-default-footer
        :items="items"
        :items-per-page="-1"
        @current-items="cc"
      >
        <template v-slot:item="{ item }">
          <tr v-ripple="{ center: true }" @contextmenu.prevent="show(item, $event)">
            <td class="text-right">{{ item.ProductCode }}</td>
          </tr>

          <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
            <v-list>
              <v-list-item v-for="(i, index) in menuItem" :key="index" @click="xx">
                <v-list-item-title>{{ i.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-flex>
    <!-- ************** -->
    <!-- Bottom Section -->
    <!-- ************** -->
    <template v-slot:append>
      <v-divider></v-divider>
      <v-card flat tile height="200">
        <v-card-title class="justify-end grey--text">Total: {{ totalAmount }}</v-card-title>
      </v-card>
    </template>

    <!-- dialogs -->
    <!-- <payment-dialog :show-dialog.sync="showPaymentDialog"></payment-dialog> -->
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";
import { ICartItem } from "@/types";

@Component({})
export default class PurchaseDrawer extends Vue {
  // properties
  private index = 0;
  private selectedIndex = -1;
  private selectedItem = {};

  @Prop({ default: [] as ICartItem[] }) items?: ICartItem[];

  xx(item) {
    // console.log(JSON.stringify(item));
  }

  showMenu = false;
  x = 0;
  y = 0;
  menuItem = [{ title: "Delete" }];

  show(item, e) {
    // e.preventDefault();

    this.selectedIndex = this.items.indexOf(item);
    this.selectedItem = Object.assign({}, item);
    console.log(JSON.stringify(this.selectedIndex));
    this.showMenu = false;
    this.x = e.clientX;
    this.y = e.clientY;
    this.$nextTick(() => {
      this.showMenu = true;
    });
  }

  cc(item) {
    //console.log("curent-item");
    //console.log(JSON.stringify(item));
  }

  // ** Total Amount of the drawer
  get totalAmount(): number {
    let total: number = 0;
    return total;
  }

  @Watch("items", { deep: true })
  private async onOrderChange() {
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
}
</script>
