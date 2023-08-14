import axios from "axios";
import {
  NewUserRequestBody,
  SigninRequestBody,
  TokenRequestBody,
  TokenResponseBody,
  UserResponseBody
} from "../types/apiTypes";
import CookieService from "./CookieService";
import TokenRefreshService from "./TokenRefreshService";

const api = axios.create({
  baseURL: getEnv('REACT_APP_BASE_URL', 'http://localhost:8080/api/v1'),
});

function getEnv(varName: string, defaultValue: string): string {
  return process.env[varName] || defaultValue;
}
export const signup = (user: NewUserRequestBody) => {
  return api.post<UserResponseBody>('/auth/signup?lang=ru', user);
};

export const signin = (user: SigninRequestBody) => {
  return api.post<TokenResponseBody>('/auth/signin', user);
};

export const refreshToken = (token: TokenRequestBody) => {
  return api.post<TokenResponseBody>('/auth/refresh', token);
};

let isRefreshing = false;

api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  let refreshToken = CookieService.getCookie('refreshToken');

  if (error.response.status === 401 && refreshToken && !originalRequest._retry) {
    if (!isRefreshing) {
      isRefreshing = true;
      await TokenRefreshService.refresh(refreshToken)
        .then(() => {
          isRefreshing = false;
        })
        .catch(() => {
          CookieService.deleteCookie('refreshToken');
          CookieService.deleteCookie('accessToken');
          isRefreshing = false;
        });
    }

    refreshToken = CookieService.getCookie('refreshToken'); // get the new refresh token in case it has been updated

    if (refreshToken && !isRefreshing) {
      originalRequest._retry = true;
      return TokenRefreshService.refresh(refreshToken).then((res) => {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.accessToken;
        CookieService.setCookie("accessToken", res.data.accessToken, 1);
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.accessToken;
        return api(originalRequest);
      });
    }
  }
  return Promise.reject(error);
});
export default api;
