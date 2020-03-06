<template>
  <v-data-iterator
    :items="items"
    :items-per-page.sync="paginationSync.itemsPerPage"
    :page.sync="paginationSync.page"
    :options.sync="paginationSync"
    :server-items-length="totalItems"
    :footer-props="{ showFirstLastPage, showCurrentPage }"
    @update:options="handleUpdate"
  >
    <template v-slot:default="props">
      <v-layout row wrap>
        <v-flex v-for="item in props.items" :key="item.LicensePlate" xs12 sm6 md4 lg3>
          <listing-card
            :title="item.LicensePlate"
            :image-source="imageSource"
            :size-of-property="item.DepotName"
            :number-of-bed="numberOfBed"
            :number-of-bath="numberOfBath"
          ></listing-card>
        </v-flex>
      </v-layout>
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator";
import * as api from "@/services";
import { IHeaderType, IOptions } from "@/types";

@Component({
  components: {
    ListingCard: () => import("@/components/card/listing-card.vue")
  }
})
export default class PropertiesIterator extends Vue {
  // Data Iterator
  @Prop() loading?: boolean;
  @Prop() items?: any[];
  @Prop() options?: IOptions;
  @Prop() totalItems?: number;
  // options = {};

  // Cards Properties
  @Prop({ default: "Bath" }) numberOfBath?: String;
  @Prop({ default: "Bed" }) numberOfBed?: String;
  @Prop({ default: "Size" }) sizeOfProperty?: String;
  @Prop({ default: "https://cdn.vuetifyjs.com/images/cards/house.jpg" }) imageSource?: String;

  private paginationSync = {} as any;
  private showFirstLastPage = true;
  private showCurrentPage = true;
  // private total_items = 0;

  @Watch("options", { immediate: true, deep: true })
  private async onOptionsChange() {
    console.log("watch - option - inside properties-iterator");
    this.paginationSync = this.options;
    //this.total_items
  }

  handleUpdate = (e: IOptions) => {
    console.log("handleUpdate - inside properties-iterator");
    this.updatePagination(e);
  };

  @Emit("update:options")
  updatePagination(e: IOptions) {
    return e;
  }
}
</script>
