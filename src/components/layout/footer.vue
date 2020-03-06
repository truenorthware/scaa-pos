<template>
  <v-footer app inset dark height="auto" class="footercolor">
    <v-layout row justify-center>
      <v-flex xs12 md10 class="mt-3">
        <v-card flat justify-center tile class="footercolor text-xs-center">
          <v-card-text>
            <v-btn v-for="appsaccount in appsaccounts" :key="appsaccount.name" class="pa-0 mx-1 mb-4">
              <V-img :src="appsaccount.img" contain></V-img>
            </v-btn>
          </v-card-text>
          <v-hover>
            <v-card-text class="py-0">
              <!-- <v-btn
                text
                v-for="footerlink in footerlinks"
                :key="footerlink.name"
                :to="footerlink.link"
                class="pa-0"
              >
                <h5 class="footer-heading px-5 py-2 darkblue--text font-weight-regular hover-me">
                  {{ footerlink.name }}
                </h5>
              </v-btn> -->
            </v-card-text>
          </v-hover>
          <v-hover>
            <v-card-text class="pa-0">
              <a class="website-link" href>
                <h5 class="themecolor1--text font-weight-regular subtitle-2 hover-me">
                  hello@onesim.com.hk
                </h5>
              </a>
            </v-card-text>
          </v-hover>
          <v-card-text class="pb-0">
            <v-btn v-for="icon in icons" :key="icon" class="mx-3 themecolor1--text" icon>
              <v-icon size="24px" class="hover-me">{{ icon }}</v-icon>
            </v-btn>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="themecolor1--text mt-1">
            &copy;2018 —
            <strong>Vuetify</strong>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";

@Component({})
export default class Footer extends Vue {
  // properties
  private company = "OneSIM";
  private appsaccounts = [
    { name: "google", img: require("@/assets/img/apple-store.png") },
    { name: "apple", img: require("@/assets/img/google-play.png") }
  ];

  private footerlinks = [
    { name: "About OneSIM", link: "/about" },
    { name: "Partner with Us", link: "/about" },
    { name: "Press Releases", link: "/home" },
    { name: "B Rewards", link: "/contact" },
    { name: "Terms & Conditions", link: "/about" }
  ];
  private icons = ["fab fa-facebook", "fab fa-twitter", "fab fa-google-plus", "fab fa-linkedin", "fab fa-instagram"];
}
</script>
<style scoped>
#core-footer {
  z-index: 0s;
}
.footer-heading {
  background-color: #ededed !important;
}
.website-link {
  text-decoration: none;
  display: inline-block;
}
.v-divider {
  width: 30%;
  border-color: #dcdcdc;
  text-align: center;
  display: inline-block;
}
.hover-me:hover {
  color: #ff9800 !important;
}
</style>
