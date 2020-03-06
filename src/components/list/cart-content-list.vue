<template>
  <div ref="listCartItems" style="height: 100%; overflow:scroll;">
    <v-list shaped>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item
          v-for="(item, index) in cartItems"
          :key="index"
          two-line
          @contextmenu.prevent="$refs.menuCartItem.open($event, index)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle
              >Quantity: {{ item.quantity }}, Unit Price: ${{ item.price }}</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-list-item-action>
            <h3>${{ item.price * item.quantity }}</h3>
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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Admin {
  id: number;
  name: string;
}

@Component({})
export default class CartContentList extends Vue {
  private name = "cart-content-list";

  @Prop({ default: false }) showDialog?: boolean;
  private selectedAdmin: number = 1;
  private admins: Admin[] = [
    {
      id: 1,
      name: "John Doe"
    },
    {
      id: 2,
      name: "Marc Demo"
    },
    {
      id: 3,
      name: "Mitchell Admin"
    }
  ];
}
</script>
