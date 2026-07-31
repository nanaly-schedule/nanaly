import BaseModal from '@/src/shared/ui/BaseModal';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({
  visible,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <BaseModal.Content>
        <BaseModal.Text>계정을 삭제할까요?</BaseModal.Text>
      </BaseModal.Content>
      <BaseModal.Actions>
        <BaseModal.Button variant="secondary" onPress={onClose}>
          아니요
        </BaseModal.Button>
        <BaseModal.Button onPress={onConfirm}>계정 삭제</BaseModal.Button>
      </BaseModal.Actions>
    </BaseModal>
  );
}
