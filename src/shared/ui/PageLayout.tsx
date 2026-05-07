import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacingSpacing16 } from '@/src/init/styles/tokens';

import Header from './Header';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showBackButton?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PageLayout({
  children,
  title = '',
  showHeader = true,
  showBackButton = true,
  style,
}: PageLayoutProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { marginTop: insets.top }, style]}>
      {showHeader && <Header title={title} showBackButton={showBackButton} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacingSpacing16,
  },
});
