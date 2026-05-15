import { Redirect, useLocalSearchParams } from 'expo-router';

export default function Tabs() {
  const { storeId, displayStoreName, isOwner } = useLocalSearchParams<{
    storeId: string;
    displayStoreName?: string;
    isOwner?: string;
  }>();

  return (
    <Redirect
      href={{
        pathname:
          isOwner === 'true' ? '/[storeId]/home/admin' : '/[storeId]/home',
        params: {
          storeId,
          displayStoreName,
          isOwner,
        },
      }}
    />
  );
}
