export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string; // '1990-01-01';
}

export interface SocialLoginRequest {
  idToken: string;
  accessToken: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
