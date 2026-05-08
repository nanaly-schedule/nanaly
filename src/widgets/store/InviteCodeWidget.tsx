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
      const response = await createInviteCode(storeId);
      //todo: re test when getting domain
      //   await Share.share({
      //     message: inviteLink,
      //     url: inviteLink,
      //   });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <NText variant="r14" style={{ color: typoColorSub1 }}>
        초대하기
      </NText>
      <Pressable disabled={isSubmitting} onPress={handleShareInviteLink}>
        <ShareIcon size={20} color={typoColorPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radiusRadius12,
    paddingHorizontal: spacingSpacing8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: backgroundColorWhite,
  },
});
