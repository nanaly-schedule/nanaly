import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import {
  createPosition,
  deletePosition,
  getPositions,
} from '@/src/features/schedule/api/position';
import useUser from '@/src/features/user/lib/useUser';
import {
  buttonColorCta,
  buttonColorUnavailable,
  typoColorPrimary,
  typoColorRed,
  typoColorSub2,
} from '@/src/init/styles/tokens';
import AccessDenied from '@/src/shared/ui/AccessDenied';
import BaseModal from '@/src/shared/ui/BaseModal';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import { SchedulePosition } from '@/src/widgets/schedule/mock';
import {
  mapPositionResponse,
  mapPositionResponses,
} from '@/src/widgets/schedule/positionMapper';

const COLORS = ['#60A5FA', '#F6983B', '#46D81D', '#8B7CF6', '#14B8A6'];
const MAX_POSITION_COUNT = 5;

function normalizeStoreId(value?: string | string[]) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  if (!nextValue || nextValue === 'undefined' || nextValue === 'null') {
    return undefined;
  }

  return nextValue;
}

function getPositionCreateErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return '포지션 생성에 실패했어요';
  }

  const responseData = error.response?.data;
  const message =
    typeof responseData === 'string'
      ? responseData
      : typeof responseData?.message === 'string'
        ? responseData.message
        : '';
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes('color') ||
    normalizedMessage.includes('colour') ||
    message.includes('색상')
  ) {
    return '이미 등록된 컬러예요';
  }

  return '포지션 생성에 실패했어요';
}

export default function PositionManagePage() {
  const params = useLocalSearchParams<{ storeId?: string | string[] }>();
  const routeStoreId = normalizeStoreId(params.storeId);
  const currentStoreId = useUser((state) => state.currentStoreId);
  const storeId = routeStoreId ?? currentStoreId ?? '';
  const access = useCurrentStoreAccess();
  const [positions, setPositions] = useState<SchedulePosition[]>([]);
  const [createVisible, setCreateVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SchedulePosition | null>(
    null,
  );
  const [name, setName] = useState('');
  const [color, setColor] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const canCreate = positions.length < MAX_POSITION_COUNT;

  useEffect(() => {
    if (!storeId) {
      return;
    }

    const fetchPositions = async () => {
      try {
        const { data } = await getPositions(storeId);

        setPositions(mapPositionResponses(data));
      } catch {
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [storeId]);

  if (!access.loaded) {
    return <View />;
  }

  if (!access.canEditSchedule) {
    return (
      <AccessDenied message="현재 매장 권한으로는 포지션을 변경할 수 없어요" />
    );
  }

  const handleCreate = async () => {
    if (!storeId) {
      setErrorMessage('매장 정보를 찾을 수 없어요');
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('포지션명을 입력해주세요');
      return;
    }

    if (positions.some((position) => position.name === trimmedName)) {
      setErrorMessage('이미 등록된 포지션이에요');
      return;
    }

    if (!color) {
      setErrorMessage('포지션 색상을 선택해주세요');
      return;
    }

    if (
      positions.some(
        (position) => position.color.toLowerCase() === color.toLowerCase(),
      )
    ) {
      setErrorMessage('이미 등록된 컬러예요');
      return;
    }

    setSaving(true);

    try {
      const { data } = await createPosition(storeId, {
        name: trimmedName,
        color,
      });
      const createdPosition =
        mapPositionResponse(data) ??
        ({
          id: data?.positionId ?? data?.id ?? `position-${Date.now()}`,
          name: trimmedName,
          color,
        } satisfies SchedulePosition);

      setPositions((prev) => [...prev, createdPosition]);
      setName('');
      setColor(null);
      setErrorMessage('');
      setCreateVisible(false);
    } catch (error) {
      setErrorMessage(getPositionCreateErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!storeId || !deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await deletePosition(storeId, deleteTarget.id);
      setPositions((prev) =>
        prev.filter((position) => position.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch {
      setErrorMessage('포지션 삭제에 실패했어요');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageLayout title="포지션 관리">
      <View style={styles.container}>
        <NText variant="r12" style={styles.label}>
          포지션 목록
        </NText>

        {loading ? (
          <View style={styles.empty}>
            <NText variant="r14" style={styles.emptyText}>
              포지션을 불러오는 중이에요
            </NText>
          </View>
        ) : positions.length === 0 ? (
          <View style={styles.empty}>
            <NText variant="r14" style={styles.emptyText}>
              등록된 포지션이 없어요
            </NText>
          </View>
        ) : (
          <View style={styles.list}>
            {positions.map((position) => (
              <View key={position.id} style={styles.row}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: position.color },
                  ]}
                />
                <NText variant="r14" style={styles.positionName}>
                  {position.name}
                </NText>
                <Pressable
                  disabled={deleting}
                  onPress={() => {
                    setErrorMessage('');
                    setDeleteTarget(position);
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={typoColorSub2}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable
          disabled={!canCreate}
          style={[
            styles.createButton,
            !canCreate && styles.disabledCreateButton,
          ]}
          onPress={() => {
            setErrorMessage('');
            setCreateVisible(true);
          }}
        >
          <NText variant="m16" style={styles.createButtonText}>
            포지션 생성하기
          </NText>
        </Pressable>
      </View>

      <BaseModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
      >
        <BaseModal.Content style={styles.modalContent}>
          <BaseModal.Title>포지션 생성</BaseModal.Title>
          <TextInput
            placeholder="포지션명을 입력해주세요"
            placeholderTextColor="#A5A5A5"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <View style={styles.colors}>
            {COLORS.map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.colorButton,
                  { backgroundColor: item },
                  color === item && styles.selectedColor,
                ]}
                onPress={() => setColor(item)}
              />
            ))}
          </View>
          {errorMessage && (
            <NText variant="r12" style={styles.error}>
              {errorMessage}
            </NText>
          )}
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button onPress={handleCreate}>
            {saving ? '생성중' : '생성하기'}
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>

      <BaseModal
        visible={!!deleteTarget}
        onClose={() => {
          if (!deleting) {
            setDeleteTarget(null);
          }
        }}
        closeOnBackdropPress={!deleting}
      >
        <BaseModal.Content>
          <BaseModal.Text>
            {deleteTarget?.name} 포지션을 삭제할까요?
          </BaseModal.Text>
          {errorMessage && (
            <NText variant="r12" style={styles.error}>
              {errorMessage}
            </NText>
          )}
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            disabled={deleting}
            onPress={() => setDeleteTarget(null)}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button
            disabled={deleting}
            onPress={handleDelete}
          >
            {deleting ? '삭제중' : '삭제하기'}
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  label: {
    marginBottom: 12,
    color: typoColorPrimary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: typoColorSub2,
  },
  list: {
    gap: 12,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  colorDot: {
    width: 8,
    height: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  positionName: {
    flex: 1,
    color: typoColorPrimary,
  },
  createButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: buttonColorCta,
    marginTop: 'auto',
    marginBottom: 24,
  },
  disabledCreateButton: {
    backgroundColor: buttonColorUnavailable,
  },
  createButtonText: {
    color: '#FFFFFF',
  },
  modalContent: {
    alignItems: 'stretch',
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 12,
    color: typoColorPrimary,
  },
  colors: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  colorButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#333333',
  },
  error: {
    marginTop: 10,
    color: typoColorRed,
  },
});
