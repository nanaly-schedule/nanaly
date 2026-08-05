import BaseModal from '@/src/shared/ui/BaseModal';

interface EmailVerificationLimitExceededModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function EmailVerificationLimitExceededModal({
  visible,
  onConfirm,
  onClose,
}: EmailVerificationLimitExceededModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <BaseModal.Content>
        <BaseModal.Text>
          이메일 인증 횟수가 초과되었습니다. 다음날 다시 시도해주세요
        </BaseModal.Text>
      </BaseModal.Content>
      <BaseModal.Actions>
        <BaseModal.Button fullWidth onPress={onConfirm}>
          확인
        </BaseModal.Button>
      </BaseModal.Actions>
    </BaseModal>
  );
}
