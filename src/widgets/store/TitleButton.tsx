import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';

import {
  backgroundColorWhite,
  radiusRadius8,
  spacingSpacing8,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import RightArrowIcon from '@/src/shared/assets/RightArrowIcon';
import NText from '@/src/shared/ui/NText';

interface TitleButtonProps {
  title: string;
  isPlaceholder?: boolean;
  showIcon?: boolean;
  textStyle?: StyleProp<TextStyle>;
  onPress: (e: GestureResponderEvent) => void;
}

export default function TitleButton({
  title,
  onPress,
  isPlaceholder = false,
  showIcon = true,
  textStyle,
}: TitleButtonProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <NText
        variant="m14"
        style={[
          { color: isPlaceholder ? typoColorSub1 : typoColorPrimary },
          textStyle,
        ]}
      >
        {title}
      </NText>
      <View style={{ paddingHorizontal: 6 }}>
        {showIcon && <RightArrowIcon size={24} color={typoColorPrimary} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radiusRadius8,
    paddingHorizontal: spacingSpacing8,
    backgroundColor: backgroundColorWhite,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
