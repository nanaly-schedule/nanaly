import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { getMemberRoleLabel, MemberRole } from '@/src/entities/member/member';
import { getMembers } from '@/src/features/store/api/member';
import {
  backgroundColorWhite,
  radiusRadius8,
  spacingSpacing8,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing30,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import { getDevMockMemberList } from '@/src/mocks/server';
import SearchIcon from '@/src/shared/assets/SearchIcon';
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

  const [worker, setWorker] = useState('');
  const [debouncedWorker, setDebouncedWorker] = useState('');
  useEffect(() => {
    if (!storeId) {
      return;
    }

    const fetchMembers = async () => {
      try {
        const { data } = await getMembers(storeId, debouncedWorker);
        setWorkers(data);
      } catch {
        if (__DEV__) {
          setWorkers(getDevMockMemberList(debouncedWorker));
        }
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
        />
      </View>

      <ScrollView
        style={{ flex: 1, marginBottom: spacingSpacing12 }}
        contentContainerStyle={styles.workersContainer}
      >
        {workers.map((item) => {
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
              <NText variant="r14">·</NText>
              <NText variant="r14">{getMemberRoleLabel(item.role)}</NText>
              <View style={{ margin: 'auto' }} />
              <NText variant="r14">{item.joinDate}</NText>
              {item.leaveDate && <NText variant="r14">-</NText>}
              {item.leaveDate && <NText variant="r14">{item.leaveDate}</NText>}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
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
    paddingHorizontal: spacingSpacing8,
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
    paddingHorizontal: spacingSpacing8,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  workerContainer: {
    height: 52,
    alignItems: 'center',
  },
});
