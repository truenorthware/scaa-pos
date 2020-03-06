<template>
  <div>
    <v-carousel cycle interval="5000">
      <v-responsive :aspect-ratio="16 / 9">
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
          :src="item.src"
          reverse-transition="fade"
          transition="fade"
        ></v-carousel-item>
      </v-responsive>
    </v-carousel>
    <v-card d-flex md4>
      <v-card-title>This is title</v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class ErrorPage extends Vue {
  items = [
    {
      src: "https://www.airsim.com.hk/image/catalog/homebanner/airsimbuy-bg.jpg"
    },
    {
      src: "https://www.airsim.com.hk/image/catalog/setting/how-to-use-en-20180104.jpg"
    }
    // {
    //   src: require("@/assets/img/photo-1.jpg")
    // },
    // {
    //   src: require("@/assets/img/photo-2.jpg")
    // },
    // {
    //   src: require("@/assets/img/photo-3.jpg")
    // },
    // {
    //   src: require("@/assets/img/photo-4.jpg")
    // }
  ];
}

// // https://www.airsim.com.hk/image/catalog/homebanner/airsimbuy-bg.jpg
// // https://www.airsim.com.hk/image/cache/catalog/simcard/singaporesim-269x425.jpg
</script>
