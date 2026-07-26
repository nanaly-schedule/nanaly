import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { getMemberRoleLabel, MemberRole } from '@/src/entities/member/member';
import { getMembers } from '@/src/features/store/api/member';
import {
  backgroundColorWhite,
  basicColorGrey100,
  basicColorGrey200,
  radiusRadius8,
  spacingSpacing8,
  spacingSpacing10,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing30,
  spacingSpaicng14,
  typoColorPrimary,
  typoColorSecondary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import SearchIcon from '@/src/shared/assets/SearchIcon';
import XIcon from '@/src/shared/assets/XIcon';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

interface WorkerSectionProps {
  totalWorker: number;
}
//{"id": "c9c5ce71-3b8d-4447-96c6-21dbc1ee99d8", "joinDate": "2026-05-11", "leaveDate": null, "name": "이지현", "role": "staff"}

type TypeMember = {
  id?: string;
  memberId?: string;
  joinDate: string;
  leaveDate: string | null;
  name: string;
  role: MemberRole;
};

export default function WorkerSection({ totalWorker }: WorkerSectionProps) {
  const route = useRouter();
  const isFocused = useIsFocused();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  const [workers, setWorkers] = useState<TypeMember[]>([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);

  const [worker, setWorker] = useState('');
  const [debouncedWorker, setDebouncedWorker] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  useEffect(() => {
    if (!storeId) {
      return;
    }

    const fetchMembers = async () => {
      setIsLoadingWorkers(true);
      try {
        const { data } = await getMembers(storeId, debouncedWorker);
        setWorkers(data);
      } catch {
        setWorkers([]);
      } finally {
        setIsLoadingWorkers(false);
      }
    };

    fetchMembers();
  }, [storeId, debouncedWorker, isFocused]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWorker(worker);
    }, 300);

    return () => clearTimeout(timer);
  }, [worker]);

  const handleChangeTextWorker = (t: string) => {
    setWorker(t);
  };
  const handlePressSearch = () => {};
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NText variant="b14">근무자 리스트</NText>
        <NText variant="m14">총 {totalWorker}명</NText>
      </View>
      {/* search Input */}
      <View style={[styles.row, styles.inputContainer]}>
        <Pressable onPress={handlePressSearch}>
          <SearchIcon size={20} />
        </Pressable>
        <Input
          variant=""
          style={styles.input}
          placeholder="근무자 이름을 검색해 주세요"
          value={worker}
          onChangeText={handleChangeTextWorker}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        {isInputFocused && (
          <Pressable onPress={() => setWorker('')}>
            <XIcon size={24} color={typoColorPrimary} />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={{ flex: 1, marginBottom: spacingSpacing12 }}
        contentContainerStyle={styles.workersContainer}
      >
        {isLoadingWorkers ? (
          <WorkerListSkeleton />
        ) : (
          workers.map((item) => {
            const memberId = item?.memberId ?? item.id;

            if (!memberId) {
              return null;
            }

            return (
              <Pressable
                key={`workers-${memberId}`}
                style={[styles.row, styles.workerContainer]}
                onPress={() =>
                  route.push({
                    pathname: '/member/[storeId]/[memberId]',
                    params: {
                      storeId,
                      memberId,
                    },
                  })
                }
              >
                <NText variant="sb14">{item.name}</NText>
                <NText variant="r14" style={{ color: typoColorSub1 }}>
                  ·
                </NText>
                <NText variant="r14" style={{ color: typoColorSecondary }}>
                  {getMemberRoleLabel(item.role)}
                </NText>
                <View style={{ margin: 'auto' }} />
                <NText variant="r14" style={{ color: typoColorSecondary }}>
                  {item.joinDate}
                </NText>
                {item.leaveDate && <NText variant="r14">-</NText>}
                {item.leaveDate && (
                  <NText variant="r14" style={{ color: typoColorSecondary }}>
                    {item.leaveDate}
                  </NText>
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function WorkerListSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={`worker-skeleton-${index}`} style={styles.workerContainer}>
          <View style={styles.skeletonName} />
          <View style={styles.skeletonRole} />
          <View style={{ margin: 'auto' }} />
          <View style={styles.skeletonDate} />
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacingSpacing30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: spacingSpaicng14,
    marginBottom: spacingSpacing16,
    borderRadius: radiusRadius8,
    paddingHorizontal: spacingSpacing10,
    backgroundColor: backgroundColorWhite,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
  },

  workersContainer: {
    // marginTop: spacingSpacing16,
    backgroundColor: backgroundColorWhite,
    borderRadius: spacingSpacing12,
    paddingHorizontal: spacingSpacing10,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  workerContainer: {
    height: 52,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  skeletonName: {
    width: 54,
    height: 16,
    borderRadius: radiusRadius8,
    backgroundColor: basicColorGrey200,
  },
  skeletonRole: {
    width: 40,
    height: 16,
    borderRadius: radiusRadius8,
    backgroundColor: basicColorGrey100,
  },
  skeletonDate: {
    width: 74,
    height: 16,
    borderRadius: radiusRadius8,
    backgroundColor: basicColorGrey100,
  },
});
