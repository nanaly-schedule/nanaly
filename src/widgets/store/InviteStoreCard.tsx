import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  borderDividerPrimary,
  brandColorPrimary,
  radiusRadius12,
  spacingSpacing10,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing20,
  spacingSpacing24,
} from '@/src/init/styles/tokens';
import StoreIcon from '@/src/shared/assets/StoreIcon';
import NText from '@/src/shared/ui/NText';

interface InviteStoreCardProps {
  storeName: string;
  ownerName: string;
  startDate: string;
  inviterName: string;
}

export default function InviteStoreCard({
  startDate,
  storeName,
  ownerName,
  inviterName,
}: InviteStoreCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.contentContainer]}>
        <View style={styles.image}>
          <StoreIcon size={24} color={backgroundColorWhite} />
        </View>
        <View>
          <NText variant="b16">{storeName}</NText>
          <NText variant="m12">
            대표 {ownerName} {'  '}•{'  '}개업 {startDate}
          </NText>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={[styles.row, { alignItems: 'center' }]}>
        <NText variant="b16">{inviterName}</NText>
        <NText variant="m12">님이 초대했어요</NText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radiusRadius12,
    paddingHorizontal: spacingSpacing12,
    paddingTop: spacingSpacing24,
    paddingBottom: spacingSpacing20,
    gap: spacingSpacing16,
    backgroundColor: backgroundColorWhite,
  },
  contentContainer: {
    gap: spacingSpacing10,
  },
  image: {
    backgroundColor: brandColorPrimary,
    height: 36,
    width: 36,
    borderRadius: '50%',
    padding: 6,
  },
  divider: {
    backgroundColor: borderDividerPrimary,
    height: 1,
  },
  row: {
    flexDirection: 'row',
  },
});
