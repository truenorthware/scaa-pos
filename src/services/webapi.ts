import request from "@/utils/request";

export const fetchData = (url: string) =>
  request({
    url: url,
    method: "get",
    headers: {
      "Content-Type": "application/json"
    }
  });
