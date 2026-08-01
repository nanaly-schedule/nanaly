import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorPrimary,
  spacingSpacing16,
} from '@/src/init/styles/tokens';

import Header from './Header';

interface PageLayoutProps {
  children: ReactNode;
  icon?: ReactNode;
  title?: string;
  showHeader?: boolean;
  showBackButton?: boolean;
  onPressCheckIcon?: () => void;
  onPressBack?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function PageLayout({
  children,
  icon,
  title = '',
  showHeader = true,
  showBackButton = true,
  onPressCheckIcon,
  onPressBack,
  style,
}: PageLayoutProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { marginTop: insets.top }, style]}>
      {showHeader && (
        <Header
          title={title}
          showBackButton={showBackButton}
          onPressCheckIcon={onPressCheckIcon}
          onPressBack={onPressBack}
        >
          {icon && (icon as ReactNode)}
        </Header>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacingSpacing16,
    backgroundColor: backgroundColorPrimary,
  },
});
