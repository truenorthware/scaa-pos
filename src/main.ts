import Vue from "vue";
import app from "@/app.vue";
import router from "@/router";
import store from "@/store";

import * as moment from "moment";
import VueProgressBar from "vue-progressbar";

import "@fortawesome/fontawesome-free/css/all.css";
import vuetify from "@/plugins/vuetify";
import i18n from "@/plugins/i18n";

import VueHtmlToPaper from "vue-html-to-paper";

Vue.prototype.moment = moment;
moment.locale("zh-HK");

const options = {
  color: "#fe5d16",
  failedColor: "#fe5d16",
  thickness: "5px",
  transition: {
    speed: "0.1s",
    opacity: "0.5s",
    termination: 400
  },
  autoRevert: true,
  location: "top",
  inverse: false
};

Vue.use(VueProgressBar, options);
Vue.config.productionTip = false;

const printOptions = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css"
  ]
};
Vue.use(VueHtmlToPaper, printOptions);

new Vue({
  router,
  store,
  // @ts-ignore
  vuetify,
  i18n,
  render: h => h(app)
}).$mount("#app");
