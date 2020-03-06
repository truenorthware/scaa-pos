export const BASE_URL =
  process.env.NODE_ENV === "dev"
    ? "https://lantau360.azurewebsites.net"
    : "https://lantau360.azurewebsites.net";
export const TIMEOUT_LIMIT = 15000;

// export const BASE_URL =
//   process.env.NODE_ENV === "dev" ? "https://localhost:44338" : "https://localhost:44338";
// export const TIMEOUT_LIMIT = 10000;

export const MASK_16A = "AAAAAAAAAAAAAAAA";
