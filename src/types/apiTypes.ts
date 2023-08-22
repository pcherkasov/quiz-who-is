export type NewUserRequestBody = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type SigninRequestBody = {
  username: string;
  password: string;
};

export type UserResponseBody = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type TokenResponseBody = {
  id: number;
  username: string;
  accessToken: string;
  fullName: string;
  type: string;
  refreshToken: string;
};

export type TokenRequestBody = {
  refreshToken: string;
};


//  Organisations
export type OrganisationInfoResponse = {
  id: number;
  name: string;
  description: string;
  ownerName: string;
}

export type CreateOrganisationRequest = {
  name: string;
  description: string;
}

export type UpdateOrganisationRequest = {
  id: number;
  name: string;
  description: string;
}

export interface Page<T> {
  "content": T[],
  "pageable": {
    "sort": {
      "sorted": boolean,
      "empty": boolean,
      "unsorted": boolean
    },
    "pageSize": number,
    "pageNumber": number,
    "offset": number,
    "paged": boolean,
    "unpaged": boolean
  },
  "totalPages": number,
  "totalElements": number,
  "last": boolean,
  "number": number,
  "size": number,
  "numberOfElements": number,
  "sort": {
    "sorted": boolean,
    "empty": boolean,
    "unsorted": boolean
  },
  "first": boolean,
  "empty": boolean
}


//Seasons
export type SeasonInfoResponse = {
  id: number;
  name: string;
  description: string;
  teamsQuantity: number;
  status: string;
  startedAt: string;
  finishedAt: string;
  gamesQuantity: number
}

export type SeasonResponse = {
  id: number;
  name: string;
  description: string;
  status: string;
  startedAt: string;
  finishedAt: string;
  games: GameInfoResponse[];
}

export type CreateSeasonRequest = {
  name: string;
  description: string;
}

export type UpdateSeasonRequest = {
  id: number;
  name: string;
  description: string;
}

export type UpdateSeasonStatusRequest = {
  id: number;
  status: string;
}


//Teams
export type CreateTeamRequest = {
  name: string;
  description: string;
}

export type TeamResponse = {
  id: number;
  name: string;
  description: string;
}

export type UpdateTeamRequest = {
  id: number;
  name: string;
  description: string;
}


//Games
export type CreateGameRequest = {
  name: string;
  description: string;
  roundsNumber: number;
  gameIds: number[];
}

export type GameResponse = {
  id: number;
  name: string;
  description: string;
  status: string;
  startedAt: string;
  finishedAt: string;
  teams: TeamResponse[]
}

export type UpdateGameInfoRequest = {
  id: number;
  name: string;
  description: string;
  teams: number[]
}

export type UpdateGameStatusRequest = {
  id: number;
  status: string;
}

export type GameInfoResponse = {
  id: number;
  name: string;
  description: string;
  teamsQuantity: number;
  status: string;
  startedAt: string;
  finishedAt: string;
}

export type TeamRoundResultResponse = {
  roundId: number;
  roundName: string;
  roundPointsSum: number;
  answers: AnswerInfoResponse[];
}

export type TeamGameResultResponse = {
  teamId: number;
  teamName: string;
  place: number;
  gamePointsSum: number;
  roundResults:  { [key: string]: TeamRoundResultResponse };
}

export type GameResultsResponse = {
  id: number;
  name: string;
  description: string;
  teams: TeamGameResultResponse[];
}

//Answers
export type AnswerInfoResponse = {
  id: number;
  questionId: number;
  answerType: string;
  cost: number;
  isBomb: boolean;
}
