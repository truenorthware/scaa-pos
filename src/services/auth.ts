import request from "@/utils/request";

export const login = (username: string, password: string) =>
  request({
    url: "/users/authenticate",
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      Username: username,
      Password: password
    }
  });

export const getUserInfo = (token: string) => {
  return {
    data: { roles: [], name: "", avatar: "" }
  };
};

export const logout = (token: string) =>
  request({
    url: "/users/logout",
    method: "post",
    headers: {
      Authorization: "Bearer " + token
    }
  });
