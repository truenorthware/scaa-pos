<template>
  <v-app-bar app flat dark fade-img-on-scroll>
    <v-toolbar-title>{{ appbarTitle }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-for="(appbarItem, i) in appbarItems" :key="i" class="mx-1">
      <v-btn text class="appbariconsitems-hover" :to="appbarItem.link">
        <h5 class="white--text caption font-weight-medium">{{ appbarItem.name }}</h5>
      </v-btn>
    </div>
    <v-btn text class="my-4" @click.native.prevent="doLogout">
      <v-icon>fas fa-sign-out-alt</v-icon>
    </v-btn>
    <v-snackbar v-model="hasError" :timeout="4000" color="error">
      {{ errorMessage }}
    </v-snackbar>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IMenuItem } from "@/types";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";
import { OrderModule } from "@/store/modules/order";

@Component
export default class Appbar extends Vue {
  // computed properties
  get appbarItems(): IMenuItem[] {
    return UserModule.topBarMenu;
  }

  get appbarTitle() {
    return "ER Sport POS - " + this.$t("appVersion");
  }
  get imageSource() {
    return "https://picsum.photos/1920/1080?random";
  }

  get isPOS() {
    return this.$route.path;
  }

  get hasError() {
    return AppModule.hasError;
  }

  get errorMessage() {
    return AppModule.errorMessage;
  }

  // <<<<<<< HEAD
  beforeMount() {
    // console.log("AAA", this.$store.state.draweropen);
    // let val = localStorage.getItem("drawer");
    // if (this.$store.state.draweropen == false) {
    //   AppModule.ToggleSideBar(false);
    // } else {
    //   AppModule.ToggleSideBar(true);
    // }
  }
  // methods
  toggleSideBar(): void {
    if (this.$store.state.draweropen == false) {
      this.$store.commit("updatedrawer", true);
    } else {
      this.$store.commit("updatedrawer", false);
    }
    // AppModule.ToggleSideBar(true);
  }
  // =======
  // // methods
  // toggleSideBar(): void {
  //   AppModule.ToggleSideBar(true);
  // }
  // >>>>>>> origin/vladimir

  // @Watch("isPOS", { deep: true })
  // private closeDrawer() {
  //   if (this.isPOS != "/pos-terminal") {
  //     // alert("change");
  //     if (AppModule.sidebar.opened) {
  //       AppModule.ToggleSideBar(true);
  //     }
  //   } else {
  //     AppModule.ToggleSideBar(false);
  //   }
  // }

  private doLogout() {
    UserModule.LogOut()
      .then(() => {
        console.log("logout");
        sessionStorage.removeItem("user");
        OrderModule.clearState();
        this.$router.push({ path: "/login" });
      })
      .catch(() => {});
  }
}
</script>

<style scoped>
.v-app-bar.v-app-bar--fixed {
  position: fixed;
  width: 100% !important;
  z-index: 100000;
  left: 0 !important;
}
/*.appbaricons-hover:hover {
  background: #ff9800 !important;
  color: #ffffff !important;
}
.appbariconsitems-hover:hover {*/
/* background: rgba(255, 152, 0, 0.3) !important; */
/*background: #ff9800 !important;*/
/*}
.appbariconsitems-hover h5:hover {
  color: #ffffff !important;
}*/
</style>
