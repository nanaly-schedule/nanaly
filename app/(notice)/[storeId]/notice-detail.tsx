import { StyleSheet, View } from 'react-native';

import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';

export default function NoticeDetailPage() {
  return (
    <PageLayout title="공지">
      <View style={styles.container}>
        <NText variant="h2">
          [필독] 이번 주말 야간 근무자 유의사항
        </NText>

        <View style={styles.metaContainer}>
          <NText variant="r14">3월 11일 (수)</NText>
          <NText variant="r14">이지현</NText>
          <NText variant="r14">공개</NText>
        </View>

        <View style={styles.contentContainer}>
          <NText variant="r14l">
            매장 청소 구역이 일부 조정되었습니다.
            창고 입구와 분리수거장 주변 청소 주기가 변경되었으니
            새로운 리스트를 확인해 주세요.
            {'\n\n'}
            변경된 체크리스트는 가운데 열 게시판에도
            부착되어 있습니다.
            {'\n\n'}
            모든 근무자는 교대시 해당 구역의 청결 상태를
            상호 확인해 주시기 바랍니다.
          </NText>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },

  metaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  contentContainer: {
    marginTop: 32,
  },
});