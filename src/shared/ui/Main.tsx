import { StyleSheet, View, ViewProps } from 'react-native';

interface MainProps extends ViewProps {}

/**
 * 기능:
 * - 화면 가로 세로 가운데 정렬을 위한 컴포넌트
 *
 * 이유:
 * -
 *
 * 상태 흐름:
 * -
 *
 * 실패 시나리오:
 * -
 *
 * 성능:
 * -
 *
 * 플랫폼 고려:
 * -
 *
 * 의존성:
 * -
 *
 * 트레이드오프:
 * -
 */

export default function Main({ children }: MainProps) {
  return <View style={styles.main}>{children}</View>;
}

const styles = StyleSheet.create({
  main: {
    marginVertical: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
