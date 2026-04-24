import BaseModal from '@/src/shared/ui/BaseModal';

interface VerificationCodeResendModalProps {
  visible: boolean;
  resendCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

const MAX_RESEND_COUNT = 3;

export default function VerificationCodeResendModal({
  visible,
  resendCount,
  onConfirm,
  onClose,
}: VerificationCodeResendModalProps) {
  const currentCount = Math.min(Math.max(resendCount, 0), MAX_RESEND_COUNT);

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <BaseModal.Content>
        <BaseModal.Text>
          {`인증 시간이 지나 코드를 다시 받아 주세요\n(${currentCount}/${MAX_RESEND_COUNT})`}
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
