import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Home() {
  const route = useRouter();
  return (
    <View>
      <Text>tabs/home</Text>
      <Pressable onPress={() => route.push('/(notice)/0/notice')}>
        <Text>notice</Text>
      </Pressable>
    </View>
  );
}
