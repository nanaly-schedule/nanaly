import { Stack } from 'expo-router';

import { backgroundColorPrimary } from '@/src/init/styles/tokens';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: backgroundColorPrimary },
      }}
    />
  );
}
