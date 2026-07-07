import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, View } from 'react-native';

import { createInviteCode } from '@/src/features/store/api/invite';
import {
  backgroundColorWhite,
  radiusRadius12,
  spacingSpacing8,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import ShareIcon from '@/src/shared/assets/ShareIcon';
import NText from '@/src/shared/ui/NText';

export default function InviteCodeWidget() {
  const { storeId } = useLocalSearchParams<{ storeId?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShareInviteLink = async () => {
    if (!storeId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await createInviteCode(storeId);

      const { inviteLink } = data;
      await Share.share({
        message: inviteLink,
        url: inviteLink,
      });
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Pressable
      style={styles.container}
      disabled={isSubmitting}
      onPress={handleShareInviteLink}
    >
      <NText variant="r14" style={{ color: typoColorSub1 }}>
        초대 하기
      </NText>

      <ShareIcon size={20} color={typoColorPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radiusRadius12,
    paddingHorizontal: spacingSpacing8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: backgroundColorWhite,
  },
});
