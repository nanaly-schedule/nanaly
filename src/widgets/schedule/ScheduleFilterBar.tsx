import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import * as tokens from '@/src/init/styles/tokens';
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
      <View style={styles.row}>
        {showViewFilter && (
          <View
            style={[
              styles.filterItem,
              openDropdown === 'view' && styles.openFilterItem,
            ]}
          >
            <DropdownButton
              label={viewType === 'mine' ? '나만보기' : '전체보기'}
              onPress={toggleDropdown('view')}
            />
            {openDropdown === 'view' && (
              <View style={styles.dropdown}>
                <DropdownItem
                  label="나만보기"
                  onPress={() => {
                    onChangeViewType('mine');
                    setOpenDropdown(null);
                  }}
                />
                {canSelectAllView && (
                  <DropdownItem
                    label="전체보기"
                    onPress={() => {
                      onChangeViewType('all');
                      setOpenDropdown(null);
                    }}
                  />
                )}
              </View>
            )}
          </View>
        )}

        <View
          style={[
            styles.filterItem,
            openDropdown === 'workType' && styles.openFilterItem,
          ]}
        >
          <DropdownButton
            label={workType === 'assigned' ? '일하는 날' : '쉬는 날'}
            onPress={toggleDropdown('workType')}
          />
          {openDropdown === 'workType' && (
            <View style={styles.dropdown}>
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
        </View>

        {showPositionFilter && (
          <View
            style={[
              styles.filterItem,
              openDropdown === 'position' && styles.openFilterItem,
            ]}
          >
            <DropdownButton
              label={selectedPosition}
              onPress={toggleDropdown('position')}
            />
            {openDropdown === 'position' && (
              <View style={styles.dropdown}>
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
        )}
      </View>
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
      <NText variant="m12" style={styles.buttonText}>
        {label}
      </NText>
      <Ionicons name="chevron-down" size={14} color={tokens.typoColorPrimary} />
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
    marginBottom: tokens.spacingSpacing12,
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacingSpacing8,
  },
  filterItem: {
    position: 'relative',
  },
  openFilterItem: {
    zIndex: 1,
  },
  button: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E1E3E6',
    borderRadius: tokens.radiusRadius8,
    backgroundColor: '#F5F7FA',
    paddingLeft: tokens.spacingSpacing10,
    paddingRight: 6,
  },
  buttonText: {
    color: tokens.typoColorPrimary,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  dropdown: {
    position: 'absolute',
    top: 34,
    left: 0,
    width: 140,
    borderRadius: tokens.radiusRadius12,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing8,
    paddingVertical: 0,
    shadowColor: tokens.basicColorBlackBase,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  dropdownItem: {
    height: 40,
    justifyContent: 'center',
  },
  dropdownText: {
    color: tokens.typoColorSecondary,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.borderDividerPrimary,
  },
});
