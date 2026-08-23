export interface UserProfileResponse {
  name: string;
  nickname: string | null;
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
  nickname: string | null;
}
