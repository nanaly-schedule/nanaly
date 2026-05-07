import { StyleSheet, View, ViewStyle } from 'react-native';

import {
  spacingSpacing12,
  spacingSpacing30,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface SectionHeaderProps {
  title: string;
  content: string;
  style?: ViewStyle;
}

export default function SectionHeader({
  title,
  content,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.headerContainer, style]}>
      <NText variant="h1">{title}</NText>
      <NText variant="m16">{content}</NText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    gap: spacingSpacing12,
    marginTop: spacingSpaicng14,
    marginBottom: spacingSpacing30,
  },
});
