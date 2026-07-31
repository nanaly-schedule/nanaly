import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import {
  createNotice,
  getNotice,
  updateNotice,
} from '@/src/features/notice/api/notice';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import {
  buttonColorCta,
  radiusRadius8,
  spacingSpacing10,
  spacingSpacing12,
  typoColorPlaceholder,
  typoColorPrimary,
  typoColorSub1,
  typographyPrimitiveFontSize14,
  typographyPrimitiveLetterSpacing2,
  typographyPrimitiveLineHeight16,
} from '@/src/init/styles/tokens';
import AccessDenied from '@/src/shared/ui/AccessDenied';
import BaseModal from '@/src/shared/ui/BaseModal';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';

export default function NoticeCreatePage() {
  const router = useRouter();
  const access = useCurrentStoreAccess();
  const canManageNotice =
    access.isOwner ||
    (access.role === MemberRole.MANAGER &&
      !!access.permissions?.canManageNotice);
  const { storeId, noticeId } = useLocalSearchParams<{
    storeId: string;
    noticeId?: string;
  }>();
  const isEditMode = !!noticeId;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const togglePosition = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [initialForm, setInitialForm] = useState({
    title: '',
    content: '',
    isPublic: false,
  });

  useEffect(() => {
    if (
      !access.loaded ||
      !canManageNotice ||
      !isEditMode ||
      !storeId ||
      !noticeId
    ) {
      return;
    }

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const { data } = await getNotice(storeId, noticeId);
        setTitle(data.title);
        setContent(data.content ?? '');
        setIsPublic(data.isPublic);
        setInitialForm({
          title: data.title,
          content: data.content ?? '',
          isPublic: data.isPublic,
        });
      } catch {
        setErrorMessage('수정할 공지를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [access.loaded, canManageNotice, isEditMode, noticeId, storeId]);

  const hasUnsavedChanges =
    title !== initialForm.title ||
    content !== initialForm.content ||
    isPublic !== initialForm.isPublic;

  useEffect(() => {
    Animated.timing(togglePosition, {
      toValue: isPublic ? 0 : 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isPublic, togglePosition]);

  const handlePressBack = () => {
    if (submitting) {
      return;
    }

    if (hasUnsavedChanges) {
      setExitModalVisible(true);
      return;
    }

    router.back();
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (hasUnsavedChanges) {
          setExitModalVisible(true);
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [hasUnsavedChanges]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!storeId || submitting) {
      return;
    }

    if (!trimmedTitle || !trimmedContent) {
      setErrorMessage('제목과 공지 내용을 모두 입력해 주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const data = {
        title: trimmedTitle,
        content: trimmedContent,
        isPublic,
      };

      if (isEditMode && noticeId) {
        await updateNotice(storeId, noticeId, data);
      } else {
        await createNotice(storeId, data);
      }

      router.back();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        setErrorMessage(
          isEditMode
            ? '공지를 수정할 권한이 없어요.'
            : '공지를 작성할 권한이 없어요.',
        );
      } else {
        setErrorMessage(
          isEditMode
            ? '공지 수정 중 오류가 발생했어요.'
            : '공지 작성 중 오류가 발생했어요.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!access.loaded) {
    return <View />;
  }

  if (!canManageNotice) {
    return (
      <AccessDenied
        title="공지를 관리할 수 없어요"
        message="현재 매장 권한으로는 공지를 작성하거나 수정할 수 없어요"
      />
    );
  }

  return (
    <PageLayout
      title={isEditMode ? '공지수정' : '공지작성'}
      icon={
        <NText variant="b14" style={styles.submit}>
          {submitting
            ? isEditMode
              ? '수정 중'
              : '등록 중'
            : isEditMode
              ? '수정'
              : '등록'}
        </NText>
      }
      onPressCheckIcon={handleSubmit}
      onPressBack={handlePressBack}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {loading ? (
          <NText variant="r14">불러오는 중...</NText>
        ) : (
          <>
            <View style={styles.form}>
              <TextInput
                placeholder="제목을 입력해주세요"
                placeholderTextColor={typoColorPlaceholder}
                value={title}
                onChangeText={setTitle}
                editable={!submitting}
                style={[
                  styles.titleInput,
                  isEditMode && styles.editTitleInput,
                ]}
              />

              <TextInput
                placeholder="공지 내용을 입력해주세요"
                placeholderTextColor={typoColorPlaceholder}
                value={content}
                onChangeText={setContent}
                editable={!submitting}
                multiline
                textAlignVertical="top"
                style={styles.contentInput}
              />
            </View>

            <View style={styles.settingContainer}>
              <NText variant="m14" style={styles.settingLabel}>
                공개 설정
              </NText>

              <View style={styles.segment}>
                <Animated.View
                  style={[
                    styles.selectionIndicator,
                    {
                      transform: [
                        {
                          translateX: togglePosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 52],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Pressable
                  style={styles.segmentButton}
                  disabled={submitting}
                  onPress={() => setIsPublic(true)}
                >
                  <NText
                    variant="r12"
                    style={[
                      styles.segmentText,
                      isPublic && styles.selectedSegmentText,
                    ]}
                  >
                    공개
                  </NText>
                </Pressable>

                <Pressable
                  style={styles.segmentButton}
                  disabled={submitting}
                  onPress={() => setIsPublic(false)}
                >
                  <NText
                    variant="r12"
                    style={[
                      styles.segmentText,
                      !isPublic && styles.selectedSegmentText,
                    ]}
                  >
                    비공개
                  </NText>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {errorMessage && (
          <NText variant="r12" style={styles.error}>
            {errorMessage}
          </NText>
        )}
      </KeyboardAvoidingView>

      <BaseModal
        visible={exitModalVisible}
        onClose={() => setExitModalVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>뒤로 가면 작성 중인 내용이 사라져요</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setExitModalVisible(false)}
          >
            머무르기
          </BaseModal.Button>
          <BaseModal.Button
            onPress={() => {
              setExitModalVisible(false);
              router.back();
            }}
          >
            나가기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 24,
  },
  form: {
    gap: 24,
  },
  titleInput: {
    width: '100%',
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: radiusRadius8,
    paddingHorizontal: spacingSpacing10,
    color: typoColorPrimary,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: typographyPrimitiveFontSize14,
    lineHeight: typographyPrimitiveLineHeight16,
    letterSpacing: typographyPrimitiveLetterSpacing2,
  },
  editTitleInput: {
    paddingVertical: 15,
  },
  contentInput: {
    width: '100%',
    height: 186,
    backgroundColor: '#FFFFFF',
    borderRadius: radiusRadius8,
    padding: spacingSpacing10,
    color: typoColorPrimary,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: typographyPrimitiveFontSize14,
    lineHeight: typographyPrimitiveLineHeight16,
    letterSpacing: typographyPrimitiveLetterSpacing2,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
  },
  settingLabel: {
    letterSpacing: typographyPrimitiveLetterSpacing2,
  },
  segment: {
    width: 106,
    height: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E9E9E9',
    borderRadius: radiusRadius8,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    zIndex: 1,
    borderRadius: radiusRadius8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    color: typoColorSub1,
    letterSpacing: typographyPrimitiveLetterSpacing2,
  },
  selectedSegmentText: {
    color: typoColorPrimary,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 50,
    height: 28,
    paddingHorizontal: spacingSpacing12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: radiusRadius8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  submit: {
    color: buttonColorCta,
    letterSpacing: typographyPrimitiveLetterSpacing2,
  },
  error: {
    marginTop: 12,
    color: '#F64B3B',
  },
});
