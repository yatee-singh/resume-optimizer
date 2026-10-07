export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}