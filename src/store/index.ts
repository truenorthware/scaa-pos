import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import { IAppState, IUserState, IOrderState } from "@/types";

export interface IRootState {
  app: IAppState;
  user: IUserState;
  order: IOrderState;
  draweropen: false;
}

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersistence<IRootState>({
  key: "myapp",
  storage: window.localStorage
});

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({
  mutations: {
    updatedrawer(state, val) {
      this.state.draweropen = val;
    }
  },
  plugins: [vuexLocalStorage.plugin]
});
