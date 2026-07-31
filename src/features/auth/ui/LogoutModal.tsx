import BaseModal from '@/src/shared/ui/BaseModal';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  visible,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <BaseModal.Content>
        <BaseModal.Title>로그아웃할까요?</BaseModal.Title>
        <BaseModal.Text>다시 이용하려면 로그인이 필요해요</BaseModal.Text>
      </BaseModal.Content>
      <BaseModal.Actions>
        <BaseModal.Button variant="secondary" onPress={onClose}>
          아니요
        </BaseModal.Button>
        <BaseModal.Button onPress={onConfirm}>로그아웃</BaseModal.Button>
      </BaseModal.Actions>
    </BaseModal>
  );
}
