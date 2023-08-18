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
