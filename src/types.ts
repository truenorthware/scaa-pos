export interface ResponseDatatable {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  next_page_url: string;
  prev_page_url: string;
  from: number;
  to: number;
  data: [];
}

export interface IMenuItem {
  name: string;
  title: string;
  icon: string;
  link: string;
}

export interface IUserInfo {
  username: string;
  password: string;
}

export enum HttpStatus {
  "OK" = 200,
  // 201: "Created",
  // 202: "Accepted",
  // 204: "No Content",
  // 400: "Bad Request",
  // 401: "Unauthorized, request was made with invalid credentials.",
  // 403: "Forbidden",
  // 404: "Not Found",
  // 406: "Not Acceptable",
  // 410: "Gone",
  // 422: "Unprocessable Entity",
  // 500: "Internal server error, please try again",
  // 502: "Bad Gateway",
  // 503: "Service Unavailable",
  "GATEWAY_TIMEOUTt" = 504
}

export enum DeviceType {
  Mobile,
  Desktop
}

export enum Mode {
  NULL = 0,
  QTY = 1,
  DISC = 2,
  PRICE = 3,
  DELETE = 4
}

export enum ButtonEvent {
  QTY = 10001,
  DISC = 10002,
  PRICE = 10003,
  BACKSPACE = -2
}

// Store root state
export interface RootState {
  topToolbar: TopToolbarState;
}

// Store app state
export interface IAppState {
  device: DeviceType;
}

// Store user state
export interface IOrderState {
  // orderId: string;
  // orderStatus: string;
  // OrderCartItem: OrderCartItem[];
  sessionCounter: number;
  activeSessions: ISession[];
  activeSessionIndex: number;
  currentCartItems: ICartItem[];
  currentCartItemsTrigger: boolean;
}

// Store user state
export interface IUserState {
  token: string;
  name: string;
  avatar: string;
  roles: string[];
  appbarMenu: IMenuItem[];
}

// Store modules state
export interface TopToolbarState {
  title: string;
}

export interface OrderCartItem {
  customerId: number;
  name: string;
  productcode: string;
  productunit: string;
  price: number;
  quantity: number;
  discount: number;
}

export interface IExcelResult {
  Header: any;
  Data: any;
}

export interface ICartItem {
  ProductCode: string;
  ProductName: string;
  Unit: string;
  Quantity: number;
  UnitPrice: number;
  UnitPriceString: string;
}

export interface IInvoice {
  ProductCode: string;
  ProductUnit: string;
  UnitPrice: number;
  Amount: number;
  DiscountPercent: number;
  Quantity: number;
}

export interface ICustomer {
  id: number;
  name: string;
  phone: string;
  address: string;
}

export interface ICustomer1 {
  CustomerCode: string;
  CustomerName: string;
  PhoneNumber: string;
  MobileNumber: string;
  email: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  country: string;
}

export interface IProduct {
  ProductCode: string;
  ProductName: string;
  ProductCategory: string;
  ProductUnit: string;
  UnitPrice: number;
  ImageId: number;
  ImageVersion: number;
}

export interface ISession {
  SessionId: number;
  CustomerCode: string;
  CartItems: ICartItem[];
}

export interface IStaff {
  StaffCode: string;
  DepartmentCode: string;
  StaffName: string;
  Surname: string;
  FirstName: string;
  PhoneNumber: string;
  MobileNumber: string;
  email: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  country: string;
}

export interface IHeaderType {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
  render?: (val: any) => void;
}

export interface IOptions {
  page?: number;
  itemsPerPage?: number;
  sortBy?: string[];
  sortDesc?: boolean[];
  groupBy?: string[];
  groupDesc?: boolean[];
  multiSort?: boolean;
  mustSort?: boolean;
  descending?: boolean;
}

export class RouteMeta {
  title: string;

  constructor({ title }: { title: string }) {
    this.title = title;
  }
}

export interface IInvoiceItem {
  Amount: number;
  DateTimeModified: string;
  DiscountPercent: number;
  Id: number;
  InvoiceNumber: number;
  LineNumber: number;
  ProductCode: string;
  ProductUnit?: any;
  Quantity: number;
  UnitPrice: number;
}

export interface IInvoiceRequest {
  StaffCode: string;
  PaymentMethod: number;
  PaymentAmount: number;
  CartItems: ICartItem[];
}

export interface IInvoiceResponse {
  InvoiceNumber: number;
  InvoiceDate: string;
  InvoiceAmount: number;
  PaymentMethod: number;
  PaymentAmount: number;
  ChangeAmount: number;
  PaidBy: number;
  InvoiceLines: [];
}

export interface IInvoiceReversalRequest {
  OldInvoiceNumber: number;
  StaffCode: string;
  Reasons: string;
}

export interface IFiscalBalance {
  FiscalYear: number;
  Type: number;
  OpeningDate: string;
  Opening: number;
  Closing: number;
  Flag: number;
  StaffCode: string;
}

export interface IPosPosting {
  PostingId: number;
  PostingDate: string;
  InvoiceFrom: number;
  InvoiceTo: number;
  Opening: number;
  PostingAmount: number;
  Closing: number;
  PostingCloseDate: string;
  PostingFlag: number;
  StaffCode: string;
}
