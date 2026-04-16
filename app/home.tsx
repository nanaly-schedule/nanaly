import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Home() {
  const route = useRouter();
  return (
    <View>
      <Text>Home</Text>
      <Pressable onPress={() => route.push('/auth')}>
        <Text>go to auth</Text>
      </Pressable>
      <Pressable onPress={() => route.push('/onboarding')}>
        <Text>go to onboarding</Text>
      </Pressable>
      <Pressable onPress={() => route.push('/0')}>
        <Text>go to store</Text>
      </Pressable>
    </View>
  );
}
