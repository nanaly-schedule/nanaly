import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home/index" options={{ title: '홈' }} />
      <Tabs.Screen name="schedule/index" options={{ title: '스케줄' }} />
      <Tabs.Screen name="my/index" options={{ title: '마이' }} />
    </Tabs>
  );
}
