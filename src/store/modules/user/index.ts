import {
  VuexModule,
  Module,
  MutationAction,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";

import { login, logout, getUserInfo } from "@/services/auth";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { IUserState, IMenuItem } from "@/types";
import { topMenuItems } from "./topmenu.json";

import store from "@/store";

@Module({ dynamic: true, store, name: "user" })
export default class User extends VuexModule implements IUserState {
  public token = "";
  public name = "";
  public avatar = "";
  public roles = [];
  public appbarMenu = [];

  @Action({ commit: "SET_TOKEN" })
  public async Login(userInfo: { username: string; password: string }) {
    const username = userInfo.username.trim();
    const password = userInfo.password.trim();
    let data: any = await login(username, password);

    setToken(data.Token);
    sessionStorage.setItem("user", JSON.stringify(data.Token));
    return data.Token;
  }

  @Action({ commit: "SET_TOKEN" })
  public async FedLogOut() {
    //removeToken();
    return "";
  }

  @MutationAction({ mutate: ["roles", "name", "avatar"] })
  public async GetUserInfo() {
    const token = getToken();
    if (token === undefined) {
      throw Error("GetUserInfo: token is undefined!");
    }

    const { data } = await getUserInfo(token);
    if (data.roles && data.roles.length > 0) {
      return {
        roles: data.roles,
        name: data.name,
        avatar: data.avatar
      };
    } else {
      throw Error("GetUserInfo: roles must be a non-null array!");
    }
  }

  @MutationAction({ mutate: ["token", "roles"] })
  public async LogOut() {
    // if (getToken() === undefined) {
    //   throw Error("LogOut: token is undefined!");
    // }
    await logout(getToken());
    removeToken();
    return {
      token: "",
      roles: []
    };
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }

  get isLoggedOn() {
    return Boolean(this.token);
  }

  get topBarMenu(): IMenuItem[] {
    return this.isLoggedOn ? topMenuItems : topMenuItems;
  }
}

export const UserModule = getModule(User);
