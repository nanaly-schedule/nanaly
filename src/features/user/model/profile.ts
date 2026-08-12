export interface UserProfileResponse {
  name: string;
  birthDate: string | null;
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
  birthDate: string | null;
  // name: string
}
