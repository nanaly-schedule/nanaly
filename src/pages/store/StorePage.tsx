import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function StorePage() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/0')}>
      <Text>go to store</Text>
    </Pressable>
  );
}
