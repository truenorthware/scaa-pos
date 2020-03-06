import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

const opts = {
  theme: {
    light: true,
    themes: {
      light: {
        primary: "#0000ff",
        secondary: "#fe5d16",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        themecolor1: "#141A46",
        footercolor: "#ededed",
        orange: "#ff9800"
      }
    }
  },
  options: {
    customProperties: true
  },
  icons: {
    iconfont: "fa"
  }
};

Vue.use(Vuetify);

export default new Vuetify(opts);
