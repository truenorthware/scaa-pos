import Vuex from "vuex";
import { ICartItem, IOrderState, ISession } from "@/types";
import VuexPersistence from "vuex-persist";
import {
  Action,
  getModule,
  Module,
  Mutation,
  MutationAction,
  VuexModule
} from "vuex-module-decorators";

@Module({ name: "order" })
export default class Order extends VuexModule implements IOrderState {
  public selectIndex = 0;
  public customerId = 0;
  public CustomerCartItem = [];
  public CurrentTab = 0;
  public cartRefreshTrigger = false;

  public currentCartItemsTrigger = false;
  public currentCartItems: ICartItem[] = [];
  public sessionCounter = 1;
  public activeSessionIndex = 0;
  public activeSessions: ISession[] = [
    {
      SessionId: 1,
      CustomerCode: "POS",
      CartItems: []
    }
  ];

  public orderCounter = 1;

  // @Action({ commit: "ADD_TO_ORDER_CART" })
  // public async AddToCart(orderCardItem: {
  //   customerId: number;
  //   name: string;
  //   productcode: string;
  //   productunit: string;
  //   quantity: number;
  //   price: number;
  //   discount: number;
  // }) {
  //   return orderCardItem;
  // }

  @Action({})
  public SwitchSession(tabIndex: number) {
    this.SET_ACTIVE_SESSION_INDEX(tabIndex);

    console.log("switch session reached ");
    let cartItems = this.activeSessions[tabIndex].CartItems;
    this.SET_CURRENT_CART_ITEMS(cartItems);
    this.TOGGLE_CURRENT_CARTITEMS_TRIGGER();
  }

  @Action({})
  public AddToCurrentCart(cartItem: ICartItem) {
    this.UPDATE_CURRENT_SESSION_CARTITEMS(cartItem);

    console.log("add to cart reached ");
    let cartItems = this.activeSessions[this.activeSessionIndex].CartItems;
    this.SET_CURRENT_CART_ITEMS(cartItems);
    this.TOGGLE_CURRENT_CARTITEMS_TRIGGER();
  }
  @Mutation
  private UPDATE_CURRENT_SESSION_CARTITEMS(cartItem: ICartItem) {
    // get current POS session
    //alert("activeSesionIndex " + this.activeSessionIndex);
    let currentSession = this.activeSessions[this.activeSessionIndex];
    let currentCartItems = currentSession.CartItems;

    let prouctCode = cartItem.ProductCode;

    let matchIndex = currentCartItems.findIndex(el => el.ProductCode === prouctCode);

    if (matchIndex == -1) {
      currentCartItems.push(cartItem);
    } else {
      let qty = currentCartItems[matchIndex].Quantity + cartItem.Quantity;
      currentCartItems[matchIndex].Quantity = qty;
    }

    this.activeSessions[this.activeSessionIndex].CartItems = currentCartItems;
  }

  @Mutation
  private REMOVE_CURRENT_CART_ITEM(index: number) {
    // ** bound check
    if (index >= 0 && index < this.currentCartItems.length) {
      this.currentCartItems.splice(index, 1);
    }
  }

  @Mutation
  private ADD_REMOVE_SESSION(id: number) {
    // store the POS session
    if (this.activeSessions.length == 0) {
      let cartItems: ICartItem[] = [];
      let session: ISession = { SessionId: id, CustomerCode: "POS", CartItems: cartItems };
      this.activeSessions.push(session);
    }
  }

  @Mutation
  private ADD_SESSION(num: number) {
    //let cartItems: ICartItem[] = [];
    let session: ISession = {
      SessionId: num,
      CustomerCode: "POS",
      CartItems: []
    };

    this.activeSessions.push(session);
  }

  @Mutation
  private REMOVE_SESSION_AT_POSITION(position: number) {
    this.activeSessions.splice(position, 1);
  }

  @Mutation
  public REPLACE_CURRENT_CART_ITEM(cartItem: ICartItem) {
    console.log("mutation replace cart item reached ");
    let targetIndex = this.selectIndex;
    this.currentCartItems[targetIndex] = cartItem;
  }

  // ** rewrite the cartitems in the activeSessions array
  @Mutation
  public SET_ACTIVE_SESSION_CART_ITEMS(cartItems: ICartItem[]) {
    console.log("mutation SET_ACTIVE_SESSION_CART_ITEMS reached ");
    this.activeSessions[this.activeSessionIndex].CartItems = cartItems.slice(0);
  }

  @Mutation
  public SET_ACTIVE_SESSION_INDEX(position: number) {
    this.activeSessionIndex = position;
  }

  @Mutation
  public SET_CURRENT_CART_ITEMS(cartItems: ICartItem[]) {
    console.log("mutation add to cart reached ");
    this.currentCartItems = cartItems.slice(0);
  }

  @Mutation
  public SET_SESSION_COUNTER(num: number) {
    this.sessionCounter = num;
  }

  @Mutation
  public TOGGLE_CURRENT_CARTITEMS_TRIGGER() {
    this.currentCartItemsTrigger = !this.currentCartItemsTrigger;
  }

  @Mutation
  public TOGGLE_CART_REFRESH() {
    this.cartRefreshTrigger = !this.cartRefreshTrigger;
  }

  @Action({})
  public AddSession() {
    console.log("add session reached.");
    let num = this.sessionCounter + 1;
    this.SET_SESSION_COUNTER(num);
    this.ADD_SESSION(num);

    let activeSessionIndex = this.activeSessions.length - 1;
    this.SET_ACTIVE_SESSION_INDEX(activeSessionIndex);

    // update the cart on display
    let cartItems = this.activeSessions[activeSessionIndex].CartItems;
    this.SET_CURRENT_CART_ITEMS(cartItems);
    this.TOGGLE_CURRENT_CARTITEMS_TRIGGER();
  }

  @Action({})
  public RemoveCartItem(index: number) {
    console.log("Store: remove cart item reached ");
    this.REMOVE_CURRENT_CART_ITEM(index);
    this.SET_ACTIVE_SESSION_CART_ITEMS(this.currentCartItems);
    this.TOGGLE_CURRENT_CARTITEMS_TRIGGER();
  }

  @Action({})
  public ReplaceCurrentCartItem(cartItem: ICartItem) {
    console.log("Store action: replace cart item reached ");

    this.REPLACE_CURRENT_CART_ITEM(cartItem);
    this.SET_ACTIVE_SESSION_CART_ITEMS(this.currentCartItems);
    this.TOGGLE_CURRENT_CARTITEMS_TRIGGER();
  }

  @Action({})
  public RemoveSession(tabNumber: number) {
    // ** Important
    // ** tabNumber is one based but activeSession array is zero based
    // ** The case for tabNumber = 1 will not be appeared
    let activeSessionIndex = tabNumber - 1;
    this.REMOVE_SESSION_AT_POSITION(activeSessionIndex);

    let newLength = this.activeSessions.length;

    if (newLength == 0) {
      this.AddSession();
    } else if (tabNumber > newLength) {
      this.SET_ACTIVE_SESSION_INDEX(activeSessionIndex - 1);
    } else {
      this.SET_ACTIVE_SESSION_INDEX(activeSessionIndex);
    }

    // update the cart on display
    let cartItems = this.activeSessions[this.activeSessionIndex].CartItems;
    this.SET_CURRENT_CART_ITEMS(cartItems);
    this.TOGGLE_CURRENT_CARTITEMS_TRIGGER();
  }

  @Mutation
  public async editItemAtIndex(cartItem: ICartItem) {
    let idx = this.selectIndex;
    this.currentCartItems[idx] = Object.assign({}, cartItem);
  }

  @Mutation
  public editSelectIndex(index) {
    this.selectIndex = index;
  }

  @Mutation
  public EditCurrentTab(index) {
    this.CurrentTab = index;
  }

  @Mutation
  public clearState() {
    this.selectIndex = 0;
    this.customerId = 0;
    this.CustomerCartItem = [];
    this.CurrentTab = 0;
    this.cartRefreshTrigger = false;

    this.currentCartItemsTrigger = false;
    this.currentCartItems = [];
    this.sessionCounter = 1;
    this.activeSessionIndex = 0;
    this.activeSessions = [
      {
        SessionId: 1,
        CustomerCode: "POS",
        CartItems: []
      }
    ];

    this.orderCounter = 1;
  }
  // @MutationAction({ mutate: ["orderCounter"] })
  // public async editOrderCount(count) {
  //   return {
  //     orderCounter: count
  //   };
  // }

  // ** This section is for the revised code
  get allSessions() {
    return this.activeSessions;
  }

  get getCartRefreshTrigger() {
    console.log("getCurrentCartItemsTrigger trigged");
    return this.cartRefreshTrigger;
  }

  get getCurrentCartItems() {
    console.log("getCurrentCartItems trigged");
    return this.currentCartItems;
  }

  get getSessionCounter() {
    return this.sessionCounter;
  }

  get getActiveSessionIndex() {
    return this.activeSessionIndex;
  }

  // get orderCounters(): number {
  //   return this.orderCounter;
  // }

  get getSessionId() {
    return function(tabNumber: number) {
      let idx = Math.max(tabNumber - 1, 0);
      // let length = this.activeSessions.length;

      return this.activeSessions[idx].SessionId;
    };
  }
}

const vuexLocal = new VuexPersistence({
  key: "order",
  storage: window.localStorage
});

const store = new Vuex.Store({
  modules: {
    order: Order
  },
  plugins: [vuexLocal.plugin]
});

export const OrderModule = getModule(Order, store);
