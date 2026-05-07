import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  basicColorGrey200,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing12,
  spacingSpacing20,
  spacingSpacing24,
  typoColorPlaceholder,
  typoColorPrimary,
  typoColorRed,
} from '@/src/init/styles/tokens';
import BottomSheet from '@/src/shared/ui/BottomSheet';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

interface InviteLinkBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (
    inviteLink: string,
  ) => void | string | null | Promise<void | string | null>;
}
//https://nanaly.app/invite/123123
const INVITE_LINK_PATTERN = /^https:\/\/nanaly\.app\/invite\/.+$/;

export default function InviteLinkBottomSheet({
  visible,
  onClose,
  onConfirm,
}: InviteLinkBottomSheetProps) {
  const [inviteLink, setInviteLink] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setInviteLink('');
      setIsTouched(false);
      setServerErrorMessage('');
      setIsSubmitting(false);
    }
  }, [visible]);

  const trimmedInviteLink = inviteLink.trim();
  const isInviteLinkValid = INVITE_LINK_PATTERN.test(trimmedInviteLink);
  const isError =
    isTouched && trimmedInviteLink.length > 0 && !isInviteLinkValid;
  const errorMessage = isError
    ? '초대링크를 다시 확인해 주세요'
    : serverErrorMessage;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <NText variant="b16" style={styles.title}>
          매장 초대링크를 입력해 주세요
        </NText>
        <Input
          variant={isError ? 'error' : ''}
          placeholder="초대링크를 붙여넣어 주세요"
          value={inviteLink}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => {
            setInviteLink(text);
            if (!isTouched) {
              setIsTouched(true);
            }
            if (serverErrorMessage) {
              setServerErrorMessage('');
            }
          }}
        />
        {errorMessage.length > 0 && (
          <NText variant="m12" style={styles.errorText}>
            {errorMessage}
          </NText>
        )}
      </View>
      <Pressable
        disabled={!isInviteLinkValid || isSubmitting}
        style={[
          styles.confirmButton,
          (!isInviteLinkValid || isSubmitting) && styles.disabledButton,
        ]}
        onPress={async () => {
          setIsSubmitting(true);

          try {
            const result = await onConfirm(trimmedInviteLink);

            if (typeof result === 'string' && result.length > 0) {
              setServerErrorMessage(result);
              return;
            }

            onClose();
          } catch (error) {
            setServerErrorMessage(
              error instanceof Error && error.message.length > 0
                ? error.message
                : '초대링크를 다시 확인해 주세요',
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <NText
          variant="m16"
          style={[
            styles.confirmText,
            (!isInviteLinkValid || isSubmitting) && styles.disabledButtonText,
          ]}
        >
          확인하기
        </NText>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    marginBottom: spacingSpacing20,
    flex: 1,
  },
  title: {
    color: typoColorPrimary,
    marginBottom: spacingSpacing24,
  },
  errorText: {
    color: typoColorRed,
    marginTop: spacingSpacing12,
  },
  confirmButton: {
    height: 46,
    borderRadius: radiusRadius8,
    backgroundColor: buttonColorCta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: basicColorGrey200,
  },
  confirmText: {
    color: backgroundColorWhite,
  },
  disabledButtonText: {
    color: typoColorPlaceholder,
  },
});
