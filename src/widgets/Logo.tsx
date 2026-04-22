import { StyleSheet, View } from 'react-native';
import { basicColorGrey800, spacingSpacing8 } from '../init/styles/tokens';
import AppIcon from '../shared/assets/AppIcon';
import NText from '../shared/ui/NText';

interface LogoProps {
  color: string;
}

export default function Logo({ color }: LogoProps) {
  return (
    <View style={styles.logo}>
      <AppIcon size={72} color={color} />
      <NText variant="h1" style={{ color: color, marginTop: 2 }}>
        나날이
      </NText>
      <NText variant="m14" style={{ color: color }}>
        우리 가게 스케줄 관리
      </NText>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    gap: spacingSpacing8,
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
});
