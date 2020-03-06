<template>
  <div class="home">
    <v-layout row>
      <v-flex xs12>
        <!--<v-card>
      <p class="red">Sorry, the page you're looking for doesn't exist.</p>
      </v-card>-->

        <v-card hover raised>
          <v-card-media height="300px" class="pa-5 red lighten-1">
            <div class="display-1 white--text text-center">{{ msg }}</div>
          </v-card-media>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class ErrorPage extends Vue {
  @Prop() name = "ErrorPage";

  msg = "Sorry, the page you're looking for doesn't exist.";
}
</script>
