import axios from "axios";
import { BASE_URL, TIMEOUT_LIMIT } from "./const";
import Store from "@/store";
import { AppModule } from "@/store/modules/app";

// const codeMessage = {
//   200: "OK",
//   201: "Created",
//   202: "Accepted",
//   204: "No Content",
//   400: "Bad Request",
//   401: "Unauthorized, request was made with invalid credentials.",
//   403: "Forbidden",
//   404: "Not Found",
//   406: "Not Acceptable",
//   410: "Gone",
//   422: "Unprocessable Entity",
//   500: "Internal server error, please try again",
//   502: "Bad Gateway",
//   503: "Service Unavailable",
//   504: "Gateway Timeout"
// };

function toFormData(data: any) {
  const formData = new FormData();
  for (let key in data) {
    if (typeof data[key] === "object") {
      if (data[key].value) {
        formData.append(key, data[key].value, data[key].name);
      } else {
        formData.append(key, JSON.stringify(data[key]));
      }
    } else {
      formData.append(key, data[key]);
    }
  }

  return formData;
}

const instance = axios.create();
instance.defaults.timeout = TIMEOUT_LIMIT;
instance.defaults.baseURL = BASE_URL;
// CROS
instance.defaults.withCredentials = false;

instance.defaults.headers.credentials =
  // instance.defaults.credentials =
  process.env.NODE_ENV === "dev" ? "include" : "include";

instance.interceptors.request.use(
  config => {
    if (
      config.method === "post" &&
      typeof config.headers["Content-Type"] === "undefined" &&
      config.data
    ) {
      config.data = toFormData(config.data);
    } else if (
      config.method === "post" &&
      config.headers["Content-Type"] === "application/json;charset=UTF-8"
    ) {
      config.data = JSON.stringify(config.data);
    }
    console.log("Rquest", config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    // status code == 200-300
    //   const { errcode, msg }: { errcode: number; msg: string } = response.data;
    //   return errcode === ERROR_CODE_SUCCESS || errcode === ERROR_CODE_RETRY || errcode === ERROR_CODE_FACE_RETRY ? response.data : Promise.reject(msg);
    return response.data;
    // return response;
  },
  error => {
    console.log("interceptor error!!!!!", error.message, error.response);

    const { response } = error;
    if (typeof response === "undefined") {
      const errorMessage = `Error: ${error.message}`;
      // Store.dispatch("app/showError", { errorMessage });
      AppModule.showError(errorMessage);
      setTimeout(() => {
        AppModule.dismissError();
      }, 3000);
      return Promise.reject(error);
    }

    const { status, statusText, data } = response;

    if (status === 401) {
      console.log("redirect to login");
      return;
    }

    let errorMessage = `Error[${status}]: ${statusText}`;

    if (typeof data.message !== "undefined") {
      errorMessage = `Error[${status}]: ${data.message}`;
    }

    // Store.dispatch("app/showError", { errorMessage });
    AppModule.showError(errorMessage);
    setTimeout(() => {
      AppModule.dismissError();
    }, 3000);
    return Promise.reject(errorMessage);
  }
);

export default instance;
