import { useEffect, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

import { basicColorGrey300, typoColorPrimary } from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

const rowHeight = 44;
const visibleRows = 5;

interface DateWheelColumnProps {
  items: number[];
  selectedValue: number;
  formatLabel: (value: number, isSelected: boolean) => string;
  onChange: (value: number) => void;
}

export default function DateWheelColumn({
  items,
  selectedValue,
  formatLabel,
  onChange,
}: DateWheelColumnProps) {
  const listRef = useRef<FlatList<number>>(null);
  const selectedIndex = Math.max(0, items.indexOf(selectedValue));

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
      });
    });
  }, [items.length, selectedIndex]);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.y / rowHeight);
    const nextValue = items[Math.min(Math.max(nextIndex, 0), items.length - 1)];
    if (nextValue !== selectedValue) {
      onChange(nextValue);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => String(item)}
        showsVerticalScrollIndicator={false}
        snapToInterval={rowHeight}
        decelerationRate="fast"
        bounces={false}
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, index) => ({
          length: rowHeight,
          offset: rowHeight * index,
          index,
        })}
        contentContainerStyle={styles.contentContainer}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => {
          const isSelected = item === selectedValue;
          return (
            <View style={styles.item}>
              <NText
                variant="h2"
                style={[
                  styles.text,
                  isSelected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {formatLabel(item, isSelected)}
              </NText>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: rowHeight * visibleRows,
    flex: 1,
  },
  contentContainer: {
    paddingVertical: rowHeight * 2,
  },
  item: {
    height: rowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  selectedText: {
    color: typoColorPrimary,
  },
  unselectedText: {
    color: basicColorGrey300,
  },
});
