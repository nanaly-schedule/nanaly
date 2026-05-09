import { GestureResponderEvent, StyleSheet, View } from 'react-native';

import { spacingSpacing20, spacingSpaicng14 } from '@/src/init/styles/tokens';

import InputLabel from '../shared/InputLabel';
import TitleButton from './TitleButton';

interface StoreInfoWidgetProps {
  storeName: string;
  representativeName: string;
  storeNumber: string;
  onPressStoreName: (e: GestureResponderEvent) => void;
  onPressStoreNumber: (e: GestureResponderEvent) => void;
}

export default function StoreInfoWidget({
  storeName,
  storeNumber,
  representativeName,
  onPressStoreName,
  onPressStoreNumber,
}: StoreInfoWidgetProps) {
  return (
    <View style={styles.container}>
      <View>
        <InputLabel label="매장명" />
        <TitleButton title={storeName} onPress={onPressStoreName} />
      </View>
      <View>
        <InputLabel label="등록 상호명" />
        <TitleButton
          title={representativeName}
          onPress={() => {}}
          showIcon={false}
        />
      </View>
      <View>
        <InputLabel label="대표번호" />
        <TitleButton
          title={!!storeNumber ? storeNumber : '등록된 대표번호가 없어요'}
          onPress={onPressStoreNumber}
          isPlaceholder={!storeNumber}
        />
      </View>
      {/* <View>
        <TitleButton title="사업자 다시 인증하기" onPress={} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpaicng14,
    gap: spacingSpacing20,
  },
});
