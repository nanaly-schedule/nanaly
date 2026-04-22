import { StyleSheet, View, ViewProps } from 'react-native';

interface MainProps extends ViewProps {}

export default function Main({ children }: MainProps) {
  return <View style={styles.main}>{children}</View>;
}

const styles = StyleSheet.create({
  main: {
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
