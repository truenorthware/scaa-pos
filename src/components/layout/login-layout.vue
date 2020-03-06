<template>
  <v-container fill-height justify-center align-center>
    <v-flex xs10 sm8 md6 lg5 xl4>
      <v-card class="px-3 py-5">
        <h4 class="display-1 text-center font-weight-bold mb-4">
          {{ title }}
        </h4>
        <!-- aspect-ratio="1.7778" -->
        <v-img :src="imageSource" contain position="center center" aspect-ratio="1" max-height="72"></v-img>
        <v-card-text>
          <form @submit.prevent="handleLogin">
            <v-layout wrap>
              <v-flex xs12 md12>
                <v-text-field
                  class="input-group--focused title mt-3"
                  name="username"
                  v-model="userInfo.username"
                  single-line
                  outlined
                  value="Input text"
                  :label="lblUsername"
                />
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12 md12>
                <v-text-field
                  class="input-group--focused title"
                  name="password"
                  v-model="userInfo.password"
                  single-line
                  outlined
                  value="Input text"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :label="lblPassword"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                />
              </v-flex>
            </v-layout>
            <v-btn block type="submit" color="secondary" large class="title" :loading="loading">{{
              btnTextLogin
            }}</v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

@Component({})
export default class LoginLayout extends Vue {
  private showPassword = false;

  @Prop() userInfo?: any;

  @Prop() lblUsername?: string;
  @Prop() lblPassword?: string;

  @Prop() loading?: boolean;
  @Prop() btnTextLogin?: string;

  @Prop() imageSource?: any;
  @Prop() title?: string;

  @Prop() snackbar?: boolean;
  @Prop() y?: string;
  @Prop() x?: string;
  @Prop() mode?: string;
  @Prop() timeout?: string;
  @Prop() text?: string;

  @Emit("onLogin")
  private handleLogin() {}
}
</script>
