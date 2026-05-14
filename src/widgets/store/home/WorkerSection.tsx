import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

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
import SearchIcon from '@/src/shared/assets/SearchIcon';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

interface WorkerSectionProps {
  totalWorker: number;
}
//{"id": "c9c5ce71-3b8d-4447-96c6-21dbc1ee99d8", "joinDate": "2026-05-11", "leaveDate": null, "name": "이지현", "role": "staff"}

enum Role {
  staff = '알바',
  owner = '오너',
  manager = '매니저',
}

type TypeMember = {
  id: string;
  joinDate: string;
  leaveDate: string | null;
  name: string;
  role: 'staff' | 'owner' | 'manager';
};

export default function WorkerSection({ totalWorker }: WorkerSectionProps) {
  const route = useRouter();
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
      } catch (error) {
        console.log(error);
      }
    };

    fetchMembers();
  }, [storeId, debouncedWorker]);

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

      <FlatList
        contentContainerStyle={styles.workersContainer}
        data={workers}
        keyExtractor={(item) => `workers-${item.id}`}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, styles.workerContainer]}
            onPress={() => route.push(`/member/${storeId}/${item.id}`)}
          >
            <NText variant="sb14">{item.name}</NText>
            {/* todo: Role을 사용해서 한글로 표현 */}
            <NText variant="r14">·</NText>
            <NText variant="r14">{item.role}</NText>
            <View style={{ margin: 'auto' }} />
            <NText variant="r14">{item.joinDate}</NText>
            {item.leaveDate && <NText variant="r14">-</NText>}
            {item.leaveDate && <NText variant="r14">{item.leaveDate}</NText>}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpacing30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: spacingSpaicng14,
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
    marginTop: spacingSpacing16,
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
