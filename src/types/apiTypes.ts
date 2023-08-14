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
