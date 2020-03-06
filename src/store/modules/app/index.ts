import Cookies from "js-cookie";
import store from "@/store";
import { excelUploadMap } from "./upload.json";

import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
  MutationAction
} from "vuex-module-decorators";
import { IAppState, DeviceType } from "@/types";

@Module({ dynamic: true, store, name: "app" })
class App extends VuexModule implements IAppState {
  public device = DeviceType.Desktop;

  public hasError = false;
  public errorMessage = "";

  @Action({ commit: "TOGGLE_DEVICE" })
  public ToggleDevice(device: DeviceType) {
    return device;
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device;
  }

  @MutationAction({ mutate: ["hasError", "errorMessage"] })
  public async showError(errorMessage: string) {
    return {
      hasError: true,
      errorMessage
    };
  }

  @MutationAction({ mutate: ["hasError", "errorMessage"] })
  public async dismissError() {
    return {
      hasError: false,
      errorMessage: ""
    };
  }

  get excelUpload() {
    return excelUploadMap;
  }

  // get errorMessage(): boolean {
  //   return this.errorMessage;
  // }
}

export const AppModule = getModule(App);
