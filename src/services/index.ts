import request from "@/utils/request";

export const login = (Username: String, Password: String) => {
  return request.post(
    `/users/authenticate`,
    {
      Username,
      Password
    },
    {
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    }
  );
};

export const addCustomer = (obj: any) => {
  return request.post(`/api/v1/AddPosCustomer`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const addProducts = (obj: any) => {
  return request.post(`/api/v1/AddPosProduct`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const addSession = (obj: any) => {
  return request.post(`/api/v1/AddPosPosting`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const addStaff = (obj: any) => {
  return request.post(`/api/v1/AddPosStaff`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const createInvoice = (obj: any) => {
  return request.post(`/api/v1/GetNewInvoice`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const createInvoiceReversal = (obj: any) => {
  return request.post(`/api/v1/createInvoiceReversal`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const editCustomer = (obj: any) => {
  return request.post(`/api/v1/EditPosCustomer`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const editProducts = (obj: any) => {
  return request.post(`/api/v1/EditPosProduct`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const editStaff = (obj: any) => {
  return request.post(`/api/v1/EditPosStaff`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const editPosPosting = (obj: any) => {
  return request.post(`/api/v1/EditPosPosting`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const deleteCustomer = (obj: any) => {
  return request.post(`api/v1/DeletePosCustomer`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const deleteProducts = (obj: any) => {
  return request.post(`api/v1/DeletePosProduct`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const deleteStaff = (obj: any) => {
  return request.post(`api/v1/DeletePosStaff`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const exportInvoicePendingPosting = (): Promise<any> => {
  return request.get(`/api/v1/ExportInvoicePendingPosting`, { responseType: "blob" });
};

export const exportPosCustomer = (): Promise<any> => {
  return request.get(`/api/v1/ExportPosCustomer`, { responseType: "blob" });
};

export const exportPosPosting = (): Promise<any> => {
  return request.get(`/api/v1/ExportPosPosting`, { responseType: "blob" });
};

export const exportPosProduct = (): Promise<any> => {
  return request.get(`/api/v1/ExportPosProduct`, { responseType: "blob" });
};

export const exportPosStaff = (): Promise<any> => {
  return request.get(`/api/v1/ExportPosStaff`, { responseType: "blob" });
};

export const writeItems = (obj: string) => {
  return request.post(`api/v1/getNewInvoice`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const getCountries = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string
): Promise<any> => {
  return request.get(`/api/v1/getCountries`, {
    params: { page, per_page: perPage, sort, filter }
  });
};

export const getCustomers = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string
): Promise<any> => {
  return request.get(`/api/v1/getCustomers`, {
    params: { page, per_page: perPage, sort, filter }
  });
};

export const getStaff = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string
): Promise<any> => {
  return request.get(`/api/v1/getStaff`, {
    params: { page, per_page: perPage, sort, filter }
  });
};

export const getInvoices = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string,
  postingId?: number
): Promise<any> => {
  return request.get(`/api/v1/GetInvoicesByPostingId`, {
    params: { page, per_page: perPage, sort, filter, postingId }
  });
};

export const getInvoicesOutstanding = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string
): Promise<any> => {
  return request.get(`/api/v1/GetInvoicesOutstanding`, {
    params: { page, per_page: perPage, sort, filter }
  });
};

export const getFiscalBalance = (): Promise<any> => {
  return request.get(`/api/v1/GetFiscalYearBalance`);
};

export const getInvoicesOutstandingAmount = (): Promise<any> => {
  return request.get(`/api/v1/GetInvoicesOutstandingAmount`);
};

export const getUnpostedInvoiceStatistics = (): Promise<any> => {
  return request.get(`/api/v1/GetUnpostedInvoiceStatistics`);
};

export const getInvoiceById = (id): Promise<any> => {
  return request.get(`/api/v1/GetInvoiceById`, {
    params: { id: id }
  });
};

export const getPosPostings = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string
): Promise<any> => {
  return request.get(`/api/v1/getPosPosting`, {
    params: { page, per_page: perPage, sort, filter }
  });
};

export const getPostings = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string
): Promise<any> => {
  return request.get(`/api/v1/getPostings`, {
    params: { page, per_page: perPage, sort, filter }
  });
};

export const getPosProducts = (
  page: number,
  perPage: number,
  sort?: string,
  filter?: string
): Promise<any> => {
  return request.get(`/api/v1/getPosProduct`, {
    params: { page, per_page: perPage, sort, filter }
  });
};

export const setFiscalYearBalance = (obj: any) => {
  return request.post(`api/v1/SetFiscalYearOpenBalance`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const uploadProductImage = (formData: any): Promise<any> => {
  return request.post("api/v1/UpsertPosProductImage", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const upsertPosCustomer = (obj: any) => {
  return request.post(`/api/v1/UpsertPosCustomer`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const upsertPosProduct = (obj: any) => {
  return request.post(`/api/v1/UpsertPosProduct`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};

export const upsertPosStaff = (obj: any) => {
  return request.post(`/api/v1/UpsertPosStaff`, obj, {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
};
