import { Redirect, useLocalSearchParams } from 'expo-router';

import { MemberRole } from '@/src/entities/member/member';
import useUser from '@/src/features/user/lib/useUser';

function normalizeStoreId(value?: string | string[]) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  if (!nextValue || nextValue === 'undefined' || nextValue === 'null') {
    return undefined;
  }

  return nextValue;
}

export default function Tabs() {
  const { storeId, displayStoreName, isOwner, role } = useLocalSearchParams<{
    storeId?: string | string[];
    displayStoreName?: string;
    isOwner?: string;
    role?: MemberRole;
  }>();
  const currentStoreId = useUser((state) => state.currentStoreId);
  const nextStoreId = normalizeStoreId(storeId) ?? currentStoreId;

  if (!nextStoreId) {
    return <Redirect href="/store" />;
  }

  return (
    <Redirect
      href={{
        pathname: '/[storeId]/home',
        params: {
          storeId: nextStoreId,
          displayStoreName,
          isOwner,
          role,
        },
      }}
    />
  );
}
