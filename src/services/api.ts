import axios from "axios";
import {
  AddQuestionRequest, AddTeamAnswerRequest, AnswerInfoResponse,
  CreateGameRequest,
  CreateOrganisationRequest,
  CreateRoundRequest,
  CreateSeasonRequest,
  CreateTeamRequest,
  GameResponse,
  GameResultsResponse,
  NewUserRequestBody, OneRoundResponse,
  OrganisationInfoResponse,
  Page, QuestionInfoResponse, RoundResponse,
  SeasonInfoResponse,
  SeasonResponse,
  SigninRequestBody,
  TeamResponse,
  TokenRequestBody,
  TokenResponseBody,
  UpdateGameInfoRequest,
  UpdateGameStatusRequest,
  UpdateOrganisationRequest, UpdateQuestionTypeRequest, UpdateRoundInfoRequest,
  UpdateSeasonRequest,
  UpdateSeasonStatusRequest, UpdateTeamAnswerRequest,
  UpdateTeamRequest,
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


//=======================---Auth---=======================
export const signup = (user: NewUserRequestBody) => {
  return api.post<UserResponseBody>('/auth/signup', user);
};

export const signin = (user: SigninRequestBody) => {
  return api.post<TokenResponseBody>('/auth/signin', user);
};

export const refreshToken = (token: TokenRequestBody) => {
  return api.post<TokenResponseBody>('/auth/refresh', token);
};


//=======================---Organisations---=======================
export const getOrganisations = async (page: number) => {
  const response = await api.get<Page<OrganisationInfoResponse>>(
    '/organisations?page=' + page + '&size=' + 7);
  return response.data;
};
export const getOrganisation = async (id: number | null) => {

  if (!id) {
    return;
  }
  const response = await api.get<OrganisationInfoResponse>(
    '/organisations/' + id);
  return response.data;
};
export const createOrganisation = async (organisation: CreateOrganisationRequest) => {

  const response = await api.post<OrganisationInfoResponse>(
    '/organisations',
    organisation);
  return response.data;
};
export const updateOrganisation = async (organisation: UpdateOrganisationRequest) => {

  const response = await api.put<OrganisationInfoResponse>(
    '/organisations/' + organisation.id,
    organisation);
  return response.data;
};
export const deleteOrganisation = async (id: number | null) => {

  if (!id) {
    return;
  }
  const response = await api.delete<void>(
    '/organisations/' + id);
  return response.data;
};


//=======================---Seasons---=======================
export const getSeasons = async (page: number, orgId: number) => {
  const response = await api.get<Page<SeasonInfoResponse>>(
    `/organisations/${orgId}/seasons?page=${page}&size=${7}`);
  return response.data;
};
export const getSeason = async (orgId: number, seasonId: number) => {
  const response = await api.get<SeasonResponse>(
    `/organisations/${orgId}/seasons/${seasonId}`);
  return response.data;
};
export const createSeason = async (orgId: number, season: CreateSeasonRequest) => {

  const response = await api.post<SeasonInfoResponse>(
    `/organisations/${orgId}/seasons`,
    season
  );
  return response.data;
};
export const updateSeason = async (orgId: number, season: UpdateSeasonRequest) => {

  const response = await api.put<SeasonInfoResponse>(
    `/organisations/${orgId}/seasons/${season.id}`,
    season
  );
  return response.data;
};
export const updateSeasonStatus = async (orgId: number, season: UpdateSeasonStatusRequest) => {

  const response = await api.put<SeasonInfoResponse>(
    `/organisations/${orgId}/seasons/${season.id}/status`,
    season
  );
  return response.data;
};
export const deleteSeason = async (orgId: number, seasonId: number) => {
  const response = await api.delete<void>(
    `/organisations/${orgId}/seasons/${seasonId}`
  );
  return response.data;
};


//=======================---Teams---=======================
export const getTeams = async (page: number, size: number, orgId: number) => {
  const response = await api.get<Page<TeamResponse>>(
    '/organisations/' + orgId + '/teams?page=' + page + '&size=' + size);
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

//=======================---Games---=======================
export const getGames = async (page: number, orgId: number, seasonId: number) => {
  const response = await api.get<Page<GameResponse>>(
    `/organisations/${orgId}/seasons/${seasonId}/games?page=${page}&size=${7}`);
  return response.data;
};
export const getGame = async (orgId: number, seasonId: number, gameId: number) => {
  const response = await api.get<GameResultsResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}`);
  return response.data;
};
export const createGame = async (orgId: number, seasonId: number, game: CreateGameRequest) => {
  const response = await api.post<GameResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games`,
    game
  );
  return response.data;
};
export const updateGame = async (orgId: number, seasonId: number, game: UpdateGameInfoRequest) => {
  const response = await api.put<GameResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${game.id}`,
    game
  );
  return response.data;
};
export const updateGameStatus = async (orgId: number, seasonId: number, game: UpdateGameStatusRequest) => {

  const response = await api.put<GameResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${game.id}/status`,
    game
  );
  return response.data;
};
export const deleteGame = async (orgId: number, seasonId: number, gameId: number) => {
  const response = await api.delete<void>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}`
  );
  return response.data;
};
export const downloadGameResultsAsExcel = async (orgId: number, seasonId: number, gameId: number) => {
  await api.get(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/export`,
    { responseType: 'blob' }
  ).then( response => {
  const disposition = response.headers['content-disposition'];


  let filename = 'game-results.xlsx';
  if (disposition) {
    const filenameMatch = disposition.match(/filename="?([^"]*)/i);
    if (filenameMatch && filenameMatch.length === 2) {
      filename = filenameMatch[1];
    }
  }

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  }).catch(() => {
    console.log("Error during excel creation");
  });
};


//======================---Rounds---=======================
export const createRound = async (orgId: number, seasonId: number, gameId: number, round: CreateRoundRequest) => {

  const response = await api.post<RoundResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds`,
    round
  );
  return response.data;
};
export const updateRound = async (orgId: number, seasonId: number, gameId: number, round: UpdateRoundInfoRequest) => {

  const response = await api.post<RoundResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${round.id}`,
    round
  );
  return response.data;
};
export const getRound = async (orgId: number, seasonId: number, gameId: number, roundId: number) => {
  const response = await api.get<OneRoundResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}`);
  return response.data;
};
export const deleteRound = async (orgId: number, seasonId: number, gameId: number, roundId: number) => {
  await api.delete<void>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}`
  );
};


//======================---Questions---=======================
export const createQuestion = async (orgId: number, seasonId: number, gameId: number, roundId: number, question: AddQuestionRequest) => {
  const response = await api.post<QuestionInfoResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}/questions`,
    question
  );
  return response.data;
};
export const updateQuestion = async (orgId: number, seasonId: number, gameId: number, roundId: number, question: UpdateQuestionTypeRequest) => {

  const response = await api.post<QuestionInfoResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}/questions/${question.id}`,
    question
  );
  return response.data;
};
export const deleteQuestion = async (orgId: number, seasonId: number, gameId: number, roundId: number, questionId: number) => {
  await api.delete<void>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}/questions/${questionId}`
  );
};


//======================---Answers---=======================
export const createAnswer = async (orgId: number, seasonId: number, gameId: number, roundId: number, teamId: number, questionId: number, answer: AddTeamAnswerRequest) => {
  const response = await api.post<AnswerInfoResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}/teams/${teamId}/questions/${questionId}/answers`,
    answer
  );
  return response.data;
};
export const updateAnswer = async (orgId: number, seasonId: number, gameId: number, roundId: number, teamId: number, questionId: number, answer: UpdateTeamAnswerRequest) => {
  const response = await api.post<AnswerInfoResponse>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}/teams/${teamId}/questions/${questionId}/answers/${answer.id}`,
    answer
  );
  return response.data;
};
export const deleteAnswer = async (orgId: number, seasonId: number, gameId: number, roundId: number, teamId: number, questionId: number, answerId: number) => {
  await api.delete<void>(
    `/organisations/${orgId}/seasons/${seasonId}/games/${gameId}/rounds/${roundId}/teams/${teamId}/questions/${questionId}/answers/${answerId}`
  );
};



//=======================---Interceptors---=======================
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
