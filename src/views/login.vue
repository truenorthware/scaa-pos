<template>
  <v-container fluid>
    <login-layout
      :title="$t('appTitle')"
      :lbl-username="$t('userName')"
      :lbl-password="$t('password')"
      :btn-text-login="$t('login')"
      :loading="loading"
      :image-source="imageSource"
      :user-info="userInfo"
      @onLogin="handleLogin"
    />
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { Route } from "vue-router";
import { IUserInfo } from "../types";

@Component({
  components: {
    LoginLayout: () => import("@/components/layout/login-layout.vue")
  }
})
export default class Login extends Vue {
  // properties
  private loading = false;
  private redirect: string | undefined = undefined;

  private snackbar = false;
  private y = "top";
  private x = null;
  private mode = "";
  private timeout = 6000;
  private text = "Please try again...";

  private imageSource = require("@/assets/img/logo.png");
  private userInfo: IUserInfo = { username: "", password: "" };

  // computed properties
  get snackbarText() {
    return this.text;
  }

  get homePath() {
    return "/dashboard";
  }

  // methods
  private handleLogin() {
    this.loading = true;
    UserModule.Login(this.userInfo)
      .then(() => {
        this.loading = false;
        this.$router.push({ path: this.redirect || this.homePath });
      })
      .catch(() => {
        this.loading = false;
        this.snackbar = true;
      });
  }

  mounted() {
    if (sessionStorage.getItem("user")) {
      this.$router.push({ path: this.redirect || this.homePath });
    }
  }
}
</script>
