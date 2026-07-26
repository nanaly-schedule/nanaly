import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import NText from '@/src/shared/ui/NText';

import { SchedulePosition, ScheduleViewType } from './mock';

export type ScheduleWorkType = 'assigned' | 'unavailable';

type ScheduleFilterBarProps = {
  viewType: ScheduleViewType;
  workType: ScheduleWorkType;
  positionId: string;
  positions: SchedulePosition[];
  onChangeViewType: (value: ScheduleViewType) => void;
  onChangeWorkType: (value: ScheduleWorkType) => void;
  onChangePosition: (value: string) => void;
  onPressPositionManage: () => void;
  canManagePosition?: boolean;
  canSelectAllView?: boolean;
  showViewFilter?: boolean;
  showPositionFilter?: boolean;
};

type OpenDropdown = 'view' | 'workType' | 'position' | null;

export default function ScheduleFilterBar({
  viewType,
  workType,
  positionId,
  positions,
  onChangeViewType,
  onChangeWorkType,
  onChangePosition,
  onPressPositionManage,
  canManagePosition = false,
  canSelectAllView = true,
  showViewFilter = true,
  showPositionFilter = true,
}: ScheduleFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const selectedPosition =
    positions.find((position) => position.id === positionId)?.name ??
    '전체 포지션';

  const toggleDropdown = (dropdown: OpenDropdown) => () => {
    setOpenDropdown((current) => (current === dropdown ? null : dropdown));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {showViewFilter && (
          <DropdownButton
            label={viewType === 'mine' ? '나만보기' : '전체보기'}
            onPress={toggleDropdown('view')}
          />
        )}
        <DropdownButton
          label={workType === 'assigned' ? '일하는 날' : '쉬는 날'}
          onPress={toggleDropdown('workType')}
        />
        {showPositionFilter && (
          <DropdownButton
            label={selectedPosition}
            onPress={toggleDropdown('position')}
          />
        )}
      </ScrollView>

      {openDropdown === 'view' && showViewFilter && (
        <View style={[styles.dropdown, styles.leftDropdown]}>
          <DropdownItem
            label="내근무"
            onPress={() => {
              onChangeViewType('mine');
              setOpenDropdown(null);
            }}
          />
          {canSelectAllView && (
            <DropdownItem
              label="전체근무"
              onPress={() => {
                onChangeViewType('all');
                setOpenDropdown(null);
              }}
            />
          )}
        </View>
      )}

      {openDropdown === 'workType' && (
        <View
          style={[
            styles.dropdown,
            showViewFilter ? styles.workTypeDropdown : styles.leftDropdown,
          ]}
        >
          <DropdownItem
            label="일하는 날"
            onPress={() => {
              onChangeWorkType('assigned');
              setOpenDropdown(null);
            }}
          />
          <DropdownItem
            label="쉬는 날"
            onPress={() => {
              onChangeWorkType('unavailable');
              setOpenDropdown(null);
            }}
          />
        </View>
      )}

      {openDropdown === 'position' && showPositionFilter && (
        <View style={[styles.dropdown, styles.positionDropdown]}>
          <DropdownItem
            label="전체"
            onPress={() => {
              onChangePosition('all');
              setOpenDropdown(null);
            }}
          />
          {positions.map((position) => (
            <DropdownItem
              key={position.id}
              label={position.name}
              onPress={() => {
                onChangePosition(position.id);
                setOpenDropdown(null);
              }}
            />
          ))}
          {canManagePosition && (
            <>
              <View style={styles.divider} />
              <DropdownItem
                label="포지션 관리"
                onPress={() => {
                  setOpenDropdown(null);
                  onPressPositionManage();
                }}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

function DropdownButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <NText variant="b16" style={styles.buttonText}>
        {label}
      </NText>
      <Ionicons name="chevron-down" size={16} color="#333333" />
    </Pressable>
  );
}

function DropdownItem({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.dropdownItem} onPress={onPress}>
      <NText variant="r12" style={styles.dropdownText}>
        {label}
      </NText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#333333',
    fontSize: 12,
    lineHeight: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 34,
    minWidth: 132,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  leftDropdown: {
    left: 0,
  },
  positionDropdown: {
    left: 176,
    minWidth: 168,
  },
  workTypeDropdown: {
    left: 86,
  },
  dropdownItem: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: '#333333',
  },
  divider: {
    height: 1,
    marginVertical: 4,
    backgroundColor: '#EEEEEE',
  },
});
