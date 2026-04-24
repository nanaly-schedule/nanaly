import BaseModal from '@/src/shared/ui/BaseModal';

interface ExistingEmailModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ExistingEmailModal({
  visible,
  onConfirm,
  onClose,
}: ExistingEmailModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <BaseModal.Content>
        <BaseModal.Text>이미 가입된 이메일이에요</BaseModal.Text>
      </BaseModal.Content>
      <BaseModal.Actions>
        <BaseModal.Button fullWidth onPress={onConfirm}>
          확인
        </BaseModal.Button>
      </BaseModal.Actions>
    </BaseModal>
  );
}
