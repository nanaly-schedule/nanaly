import { Redirect, useLocalSearchParams } from 'expo-router';

import { MemberRole } from '@/src/entities/member/member';

export default function Tabs() {
  const { storeId, displayStoreName, isOwner, role } = useLocalSearchParams<{
    storeId: string;
    displayStoreName?: string;
    isOwner?: string;
    role?: MemberRole;
  }>();

  return (
    <Redirect
      href={{
        pathname: '/[storeId]/home',
        params: {
          storeId,
          displayStoreName,
          isOwner,
          role,
        },
      }}
    />
  );
}
