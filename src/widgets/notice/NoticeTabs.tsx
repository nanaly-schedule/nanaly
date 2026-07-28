import { Pressable, StyleSheet, View } from 'react-native';

import * as tokens from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

export type NoticeTabType = 'all' | 'public' | 'private';

type NoticeTabsProps = {
  value: NoticeTabType;
  onChange: (tab: NoticeTabType) => void;
};

const TABS: {
  label: string;
  value: NoticeTabType;
}[] = [
  { label: '전체', value: 'all' },
  { label: '공개', value: 'public' },
  { label: '비공개', value: 'private' },
];

export default function NoticeTabs({ value, onChange }: NoticeTabsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: tokens.spacingSpacing24,
        marginBottom: 22,
      }}
    >
      {TABS.map((tab) => {
        const selected = value === tab.value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={styles.tab}
          >
            <NText
              variant="m16"
              style={[styles.label, selected && styles.selectedLabel]}
            >
              {tab.label}
            </NText>

            {selected && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: tokens.spacingSpacing20,
  },
  tab: {
    alignItems: 'center',
    paddingBottom: tokens.spacingSpacing10,
  },
  label: {
    color: '#A0A0A0',
  },
  selectedLabel: {
    color: '#222222',
  },
  indicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#222222',
  },
});
