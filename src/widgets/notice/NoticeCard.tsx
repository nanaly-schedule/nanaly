import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Notice } from '@/src/entities/notice/notice';

type NoticeCardProps = {
  notice: Notice;
  onPress?: () => void;
}

export default function NoticeCard({ notice, onPress }: NoticeCardProps) {
    return (
        <Pressable
            disabled={!onPress}
            onPress={onPress}
            style={{
                backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        }}
        >
        <View
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#6EA8FF',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
            }}
            >
                <Ionicons name="notifications" size={20} color="#fff" />
            </View>
            <View style={{flex: 1}}>
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginBottom: 6,
                    }}
                >
                    {notice.title}
                </Text>
                <Text
                    numberOfLines={2}
                    style={{
                        fontSize: 14,
                        color: '#666',
                    }}
                >
                    {notice.content?.trim() || '내용이 표시됩니다'}
                </Text>
            </View>
        </Pressable>
    );
}
