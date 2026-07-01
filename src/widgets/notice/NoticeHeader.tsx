import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NoticeHeaderProps = {
  onPress?: () => void;
};

export default function NoticeHeader({ onPress }: NoticeHeaderProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
        }}
      >
        공지사항
      </Text>

      <Ionicons name='chevron-forward' size={20} color='#666' />
    </Pressable>
  );
}