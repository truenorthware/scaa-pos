<template>
  <v-card elevation="15" width="150" @click="onClick($event)">
    <v-img contain :aspect-ratio="16 / 9" :src="thumbnail">
      <template v-slot:placeholder>
        <v-layout fill-height align-center justify-center ma-0>
          <v-progress-circular indeterminate color="grey lighten-2"></v-progress-circular>
        </v-layout>
      </template>
    </v-img>
    <v-card-text>
      <!-- <h5 class="description">{{ `${description}` }}</h5> -->
      <h5 class="description font-weight-regular text-uppercase">{{ item.ProductName }}</h5>
      <span class="price pa-1 orange lighten-2">${{ item.UnitPrice }}</span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { BASE_URL } from "@/utils/const";
import { IProduct } from "../../types";

@Component({})
export default class ProductCard extends Vue {
  @Prop({ default: {} as IProduct }) item?: IProduct;

  @Emit("onButtonClick")
  onClick(e) {
    return;
  }

  get thumbnail() {
    let ver = this.item.ImageVersion;
    console.log("version +", ver);
    return this.item.ImageId == 0
      ? require("@/assets/img/empty1.png")
      : BASE_URL + `/api/V1/GetPosProductImage?imageId=` + this.item.ImageId + "&ver=" + ver;
  }
}
</script>

<style scoped>
.description {
  line-height: 1.2em;
  /*max-height: 3.6em;*/
  /*height: 1.4em;*/
}
.price {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 15px;
  padding: 3px 10px !important;
}
</style>
