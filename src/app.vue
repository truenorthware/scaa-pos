<template>
  <v-app>
    <!-- User has Logged out -->
    <template v-if="userLoggedIn() == false">
      <router-view></router-view>
    </template>
    <!-- User is currently Logged in -->
    <template v-else>
      <top-appbar></top-appbar>
      <v-content>
        <!-- <v-card>
          <v-card-title primary-title>
            <div>
              <h1 class="headline font-weight-medium mb-0">{{ screenTitle() }}</h1>
            </div>
          </v-card-title>
        </v-card> -->
        <router-view></router-view>
      </v-content>

      <!-- <app-footer></app-footer> -->
    </template>
  </v-app>
</template>

<script lang="ts">
import moment from "moment";

import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

@Component({
  components: {
    TopAppbar: () => import("@/components/layout/appbar.vue"),
    AppFooter: () => import("@/components/layout/footer.vue")
  }
})
export default class App extends Vue {
  // properties
  private isLoading: boolean = false;
  private footerText: string = "©" + moment().format("YYYY") + "OneSIM 版權所有";

  //private aa = require("@/assets/img/background.png");
  // methods
  screenTitle(): string {
    return this.$router.currentRoute.meta.title;
  }

  userLoggedIn() {
    // return UserModule.isLoggedOn;
    return sessionStorage.getItem("user") ? true : false;
  }
}
</script>

<style scoped>
>>> .v-data-table table .v-data-table-header {
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}
>>> .v-data-table table .v-data-table-header th .v-icon:not([class*="square"]) {
  margin-left: 5px;
  height: 10px;
}
>>> .v-data-table table .v-data-table-header th .v-icon:not([class*="square"]):before {
  height: 10px;
}
>>> .v-data-table table .v-data-table-header th[aria-sort="ascending"] .v-icon,
>>> .v-data-table table .v-data-table-header th[aria-sort="none"] .v-icon {
  position: relative;
  top: -2px;
}
</style>
