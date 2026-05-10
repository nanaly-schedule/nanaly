import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import HomePage from '@/src/pages/store/home/HomePgae';

export default function Home() {
  const route = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  return (
    <View>
      <HomePage />
      <Pressable onPress={() => route.push(`/(notice)/${storeId}/notice`)}>
        <Text>notice</Text>
      </Pressable>
    </View>
  );
}
