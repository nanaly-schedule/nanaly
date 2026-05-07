import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  backgroundColorWhite,
  radiusRadius8,
  spacingSpacing8,
  spacingSpacing12,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface StoreCreateBtnProps {
  onCreateStore: (e: GestureResponderEvent) => void;
  onJoinStore: (e: GestureResponderEvent) => void;
}

export default function StoreCreateBtn({
  onCreateStore,
  onJoinStore,
}: StoreCreateBtnProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.btnContainer} onPress={onCreateStore}>
        <Image source={require('../../shared/assets/storeIcon.png')} />
        <View style={styles.textContainer}>
          <NText variant="b16" style={{ color: typoColorPrimary }}>
            매장 만들기
          </NText>
          <NText variant="r14" style={{ color: typoColorPrimary }}>
            새 매장을 등록하고 관리할 수 있어요
          </NText>
        </View>
      </Pressable>
      <Pressable style={styles.btnContainer} onPress={onJoinStore}>
        <Image source={require('../../shared/assets/doorIcon.png')} />
        <View style={styles.textContainer}>
          <NText variant="b16" style={{ color: typoColorPrimary }}>
            매장 참여하기
          </NText>
          <NText variant="r14" style={{ color: typoColorPrimary }}>
            관리자가 보낸 초대링크를 통해 참여할 수 있어요
          </NText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacingSpacing12,
  },

  btnContainer: {
    height: 86,
    alignItems: 'center',
    backgroundColor: backgroundColorWhite,
    borderRadius: radiusRadius8,
    paddingHorizontal: spacingSpacing8,
    gap: spacingSpacing8,
    flexDirection: 'row',
  },
  textContainer: {
    gap: spacingSpacing8,
  },
});
