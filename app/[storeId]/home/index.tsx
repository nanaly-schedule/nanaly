import HomePage from '@/src/pages/store/home/HomePgae';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Home() {
  const route = useRouter();
  return (
    <View>
      <HomePage />
      <Pressable onPress={() => route.push('/(notice)/0/notice')}>
        <Text>notice</Text>
      </Pressable>
    </View>
  );
}
