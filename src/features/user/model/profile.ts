export interface UserProfileResponse {
  name: string;
  birthDate: string;
  email: string;
  hasPassword: boolean;
  isTempPassword: boolean;
  socialAccounts: [
    {
      provider: 'google' | 'apple';
      providerUserId: string;
    },
  ];
}
export interface UserProfileRequest {
  birthDate: string;
  // name: string
}
