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
  roundsInfo: {[key: string]: RoundResponse};
  teams: TeamGameResultResponse[];
}


//Rounds
export type CreateRoundRequest = {
  name: string;
  description: string;
  type: string; // Can be "CLASSIC" or "BLITZ"
  questionsNumber: number;
}
export type UpdateRoundInfoRequest = {
  id: number;
  name: string;
  description: string;
  roundType: string; // Can be "CLASSIC" or "BLITZ"
}
export type RoundResponse = {
  id: number;
  name: string;
  type: string; // Can be "CLASSIC" or "BLITZ"
  description?: string;
  questions: QuestionInfoResponse[];
}
export type OneRoundResponse = {
  id: number;
  name: string;
  description: string;
  roundType: string; // Can be "CLASSIC" or "BLITZ"
  teams: { [key: string]: TeamRoundResultResponse };
}


//Questions
export type AddQuestionRequest = {
  isBomb: boolean;
  index: number;
}
export type QuestionInfoResponse = {
  id: number;
  isBomb: boolean;
  index: number;
}
export type UpdateQuestionTypeRequest = {
  id: number;
  isBomb: boolean;
}


//Answers
export type AnswerInfoResponse = {
  id: number;
  questionId: number;
  answerType: string; // Can be: "EMPTY", "WRONG", "CORRECT"
  cost: number;
  isBomb: boolean;
}
export type TeamAnswerResponse = {
  id: number;
  type: string; // Can be: "EMPTY", "WRONG", "CORRECT"
  questionId: number;
  teamId: number;
}

export type AddTeamAnswerRequest = {
  type: string; // Can be: "EMPTY", "WRONG", "CORRECT"
}
export type UpdateTeamAnswerRequest = {
  id: number;
  type: string; // Can be: "EMPTY", "WRONG", "CORRECT"
}
