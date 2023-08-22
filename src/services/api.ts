import axios from "axios";
import {
  CreateOrganisationRequest,
  NewUserRequestBody,
  OrganisationInfoResponse,
  SigninRequestBody,
  TokenRequestBody,
  TokenResponseBody,
  UpdateOrganisationRequest,
  UserResponseBody,
  Page,
  SeasonInfoResponse,
  SeasonResponse,
  CreateSeasonRequest,
  UpdateSeasonRequest,
  TeamResponse,
  CreateTeamRequest,
  UpdateTeamRequest
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


// Seasons
export const getSeasons = async (page: number, orgId: number) => {
  const response = await api.get<Page<SeasonInfoResponse>>(
    '/organisations/' + orgId + '/seasons?page=' + page + '&size=' + 3);
  return response.data;
};
export const getSeason = async (orgId: number, seasonId: number) => {
  const response = await api.get<SeasonResponse>(
    '/organisations/' + orgId + '/seasons/' + seasonId);
  return response.data;
};
export const createSeason = async (orgId: number, season: CreateSeasonRequest) => {

  const response = await api.post<SeasonInfoResponse>(
    '/organisations/' + orgId + '/seasons',
    season
  );
  return response.data;
};
export const updateSeason = async (orgId: number, season: UpdateSeasonRequest) => {

  const response = await api.put<SeasonInfoResponse>(
    '/organisations/' + orgId + '/seasons/' + season.id,
    season
  );
  return response.data;
};
export const deleteSeason = async (orgId: number, seasonId: number) => {
  const response = await api.delete<void>(
    '/organisations/' + orgId + '/seasons/' + seasonId
  );
  return response.data;
};


// Teams
export const getTeams = async (page: number, orgId: number) => {
  const response = await api.get<Page<TeamResponse>>(
    '/organisations/' + orgId + '/teams?page=' + page + '&size=' + 3);
  return response.data;
};
export const getTeam = async (orgId: number, teamId: number) => {
  const response = await api.get<TeamResponse>(
    '/organisations/' + orgId + '/teams/' + teamId);
  return response.data;
};
export const createTeam = async (orgId: number, team: CreateTeamRequest) => {

  const response = await api.post<TeamResponse>(
    '/organisations/' + orgId + '/teams',
    team
  );
  return response.data;
};
export const updateTeam = async (orgId: number, team: UpdateTeamRequest) => {

  const response = await api.put<TeamResponse>(
    '/organisations/' + orgId + '/teams/' + team.id,
    team
  );
  return response.data;
};
export const deleteTeam = async (orgId: number, teamId: number) => {
  const response = await api.delete<void>(
    '/organisations/' + orgId + '/teams/' + teamId
  );
  return response.data;
};


// Interceptors
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
