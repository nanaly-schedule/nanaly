import { Pressable } from 'react-native';

import * as tokens from '@/src/init/styles/tokens';
import RightArrowIcon from '@/src/shared/assets/RightArrowIcon';
import NText from '@/src/shared/ui/NText';

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
        marginBottom: tokens.spacingSpacing12,
      }}
    >
      <NText variant="b14">공지사항</NText>

      <RightArrowIcon size={24} />
    </Pressable>
  );
}
