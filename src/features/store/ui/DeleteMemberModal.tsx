import BaseModal from '@/src/shared/ui/BaseModal';

interface DeleteMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMemberModal({
  visible,
  onClose,
  onConfirm,
}: DeleteMemberModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <BaseModal.Content>
        <BaseModal.Text>근무자를 삭제할까요?</BaseModal.Text>
      </BaseModal.Content>
      <BaseModal.Actions>
        <BaseModal.Button variant="secondary" onPress={onClose}>
          취소
        </BaseModal.Button>
        <BaseModal.Button onPress={onConfirm}>근무자 삭제</BaseModal.Button>
      </BaseModal.Actions>
    </BaseModal>
  );
}
