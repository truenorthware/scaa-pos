<template>
  <v-card flat tile>
    <v-card-title class="justify-center grey--text">
      {{ title }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class ProductCard extends Vue {
  private name = "empty-cart-card";

  @Prop({ default: "Your shopping cart is empty" }) title?: String;
}
</script>
