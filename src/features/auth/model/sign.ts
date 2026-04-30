export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string; // '1990-01-01';
}

export interface GoogleLoginRequest {
  idToken: string;
  accessToken: string;
}
export interface AppleLoginRequest {
  identityToken: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
