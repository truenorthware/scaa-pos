<template>
  <v-btn text icon @click="handleClick"> <v-icon>edit</v-icon> </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component({
  name: "numeric-button"
})
export default class EditButton extends Vue {
  private handleClick = event => {
    this.onClick(event);
  };

  @Emit("click")
  onClick(event) {
    return event;
  }
}
</script>
