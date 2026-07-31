import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  radiusRadius12,
  spacingSpacing10,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import TitleButton from '@/src/widgets/store/TitleButton';

type MyInfoSectionProps = {
  onPressProfile: () => void;
};

export default function MyInfoSection({
  onPressProfile,
}: MyInfoSectionProps) {
  return (
    <View style={styles.box}>
      <NText variant="m12" style={styles.label}>
        내정보
      </NText>
      <TitleButton
        title="프로필 정보"
        onPress={onPressProfile}
        containerStyle={styles.item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: typoColorSub1,
  },
  box: {
    width: '100%',
    height: 86,
    borderRadius: radiusRadius12,
    backgroundColor: backgroundColorWhite,
    paddingTop: spacingSpacing10,
    paddingHorizontal: spacingSpacing10,
    gap: spacingSpacing10,
  },
  item: {
    paddingHorizontal: 0,
  },
});
