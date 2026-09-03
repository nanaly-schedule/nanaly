export interface UserProfileResponse {
  name: string;
  nickname: string | null;
  nicknameList: {
    nickname: string;
    id: string;
    storeName: string;
  }[];
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
