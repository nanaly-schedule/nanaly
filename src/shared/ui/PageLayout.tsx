import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

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
  return (
    <View style={[styles.container, style]}>
      {showHeader && (
        <Header title={title} showBackButton={showBackButton} />
      )}
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
