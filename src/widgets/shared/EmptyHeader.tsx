import { StyleSheet, View } from 'react-native';

export default function EmptyHeader() {
  return <View style={styles.container} />;
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    height: 48,
  },
});
