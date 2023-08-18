import axios from "axios";
import {
  CreateOrganisationRequest,
  NewUserRequestBody, OrganisationInfoResponse,
  SigninRequestBody,
  TokenRequestBody,
  TokenResponseBody, UpdateOrganisationRequest,
  UserResponseBody,
  Page
} from "../types/apiTypes";
import CookieService from "./CookieService";
import TokenRefreshService from "./TokenRefreshService";

const api = axios.create({
  baseURL: getEnv('REACT_APP_BASE_URL', 'http://213.188.223.117:80/api/v1'),
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

// Organisations

export const getOrganisations = async (page: number) => {
  const response = await api.get<Page<OrganisationInfoResponse>>('/organisations?page=' + page + '&size=' + 3);
  return response.data;
};

export const getOrganisation = async (id: number | null) => {
  if (!id) {
    return;
  }
  const response = await api.get<OrganisationInfoResponse>('/organisations/' + id);
  return response.data;
};

export const createOrganisation = async (organisation: CreateOrganisationRequest) => {
  const response = await api.post<OrganisationInfoResponse>('/organisations', organisation);
  return response.data;
};

export const updateOrganisation = async (organisation: UpdateOrganisationRequest) => {
  const response = await api.put<OrganisationInfoResponse>('/organisations/' + organisation.id, organisation);
  return response.data;
};

export const deleteOrganisation = async (id: number | null) => {
  if (!id) {
    return ;
  }
  const response = await api.delete<void>('/organisations/' + id);
  return response.data;
};


// Interceptors
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
          localStorage.removeItem("fullName");
          isRefreshing = false;
        });
    }

    refreshToken = CookieService.getCookie('refreshToken');

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

api.interceptors.request.use((config) => {
  const token = CookieService.getCookie('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default api;
