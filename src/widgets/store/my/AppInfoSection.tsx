import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  radiusRadius8,
  radiusRadius12,
  spacingSpacing10,
  typoColorPrimary,
  typoColorSecondary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import TitleButton from '@/src/widgets/store/TitleButton';

type AppInfoSectionProps = {
  version: string;
  onPressPrivacyPolicy: () => void;
};

export default function AppInfoSection({
  version,
  onPressPrivacyPolicy,
}: AppInfoSectionProps) {
  return (
    <View style={styles.box}>
      <NText variant="m12" style={styles.label}>
        앱정보
      </NText>
      <TitleButton
        title="개인정보 처리방침"
        onPress={onPressPrivacyPolicy}
        containerStyle={styles.item}
      />
      <View style={styles.version}>
        <NText variant="m14" style={styles.versionLabel}>
          버전
        </NText>
        <NText variant="m12" style={styles.versionValue}>
          v {version}
        </NText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: typoColorSub1,
  },
  box: {
    width: '100%',
    borderRadius: radiusRadius12,
    backgroundColor: backgroundColorWhite,
    paddingTop: spacingSpacing10,
    paddingHorizontal: spacingSpacing10,
    gap: spacingSpacing10,
  },
  item: {
    paddingHorizontal: 0,
  },
  version: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radiusRadius8,
    paddingHorizontal: 0,
  },
  versionLabel: {
    color: typoColorPrimary,
  },
  versionValue: {
    color: typoColorSecondary,
  },
});
