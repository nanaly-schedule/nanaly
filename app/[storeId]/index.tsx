import { Redirect, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function Tabs() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  return <Redirect href={`/${storeId}/home`} />;
}
