import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { sendFeedback } from '@/src/features/user/api/feedback';
import { brandColorPrimary, spacingSpaicng14 } from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';

const TITLE_MAX_LENGTH = 25;

export default function FeedbackPage() {
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleChangeFeedback = (t: string) => {
    setFeedback(t);
  };

  const handleChangeTitle = (t: string) => {
    setTitle(t.replace(/[\r\n]/g, '').slice(0, TITLE_MAX_LENGTH));
  };

  const handlePressBack = () => {
    if (!feedback.trim()) {
      router.back();
      return;
    }

    setIsExitModalVisible(true);
  };

  const handlePressSubmit = async () => {
    const trimmedFeedback = feedback.trim();
    if (isLoading) {
      return;
    }
    if (!trimmedFeedback) {
      return;
    }

    try {
      setIsLoading(true);
      await sendFeedback({ title, content: trimmedFeedback });
      setFeedback((prev) => '');
      setTitle((prev) => '');
      setIsSuccessModalVisible(true);
      setIsLoading(false);
    } catch (error) {
      console.error('의견 전송 실패', error);
    }
  };

  return (
    <>
      <PageLayout
        title="의견보내기"
        icon={
          <NText variant="b14" style={{ color: brandColorPrimary }}>
            전송
          </NText>
        }
        onPressCheckIcon={handlePressSubmit}
        onPressBack={handlePressBack}
      >
        <Input
          variant=""
          value={title}
          onChangeText={handleChangeTitle}
          maxLength={TITLE_MAX_LENGTH}
          returnKeyType="done"
          blurOnSubmit
          placeholder="제목을 작성해주세요(25글자)"
          style={[
            styles.titleInput,
            title.length === 0 && styles.titlePlaceholderInput,
          ]}
        />
        <Input
          variant=""
          value={feedback}
          onChangeText={handleChangeFeedback}
          multiline
          placeholder="불편한 점이나 아이디어를 자유롭게 적어 주세요"
          style={{
            minHeight: 186,
            textAlignVertical: 'top',
            marginTop: spacingSpaicng14,
          }}
        />
      </PageLayout>
      <BaseModal
        visible={isExitModalVisible}
        onClose={() => setIsExitModalVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Title>저장하지 않고 나갈까요?</BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setIsExitModalVisible(false)}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button
            onPress={() => {
              setIsExitModalVisible(false);
              router.back();
            }}
          >
            나가기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
      <BaseModal
        visible={isSuccessModalVisible}
        onClose={() => setIsSuccessModalVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Title>
            소중한 의견 감사합니다!{'\n'}더 나은 서비스로 보답할게요
          </BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            fullWidth
            onPress={() => {
              setIsSuccessModalVisible(false);
              router.back();
            }}
          >
            확인했어요
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </>
  );
}

const styles = StyleSheet.create({
  titleInput: {
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    textAlignVertical: 'center',
    marginTop: spacingSpaicng14,
  },
  titlePlaceholderInput: {
    fontWeight: '400',
  },
});
