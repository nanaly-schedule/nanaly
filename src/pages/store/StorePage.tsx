import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LogoutModal from '@/src/features/auth/ui/LogoutModal';
import useUser from '@/src/features/user/lib/useUser';
import {
  spacingSpacing12,
  spacingSpaicng14,
  typoColorRed,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import SectionHeader from '@/src/widgets/store/SectionHeader';
import StoreCreateBtn from '@/src/widgets/store/StoreCreateBtn';

export default function StorePage() {
  const router = useRouter();

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const clearUser = useUser((state) => state.clearUser);
  const handleLogout = async () => {
    await clearUser();
    setIsLogoutModalVisible(false);
    router.replace('/auth');
  };

  const insets = useSafeAreaInsets();

  //계정 삭제 버튼 관련 스타일은 추후 해당 페이지로 옮기면서 별도 스타일로 분리할 예정
  //이때, View 스타일의 flex : 1 또한 같이 옮겨야 함!
  return (
    <PageLayout showBackButton={false}>
      <SectionHeader
        title="어떻게 시작할까요?"
        content="매장을 직접 만들거나 초대링크로 참여할 수 있어요"
        style={{ marginTop: spacingSpaicng14 }}
      />
      <StoreCreateBtn
        onCreateStore={() => router.push('/store/create/step1')}
        onJoinStore={() => router.push('/store/join')}
      />
      <Pressable
        onPress={() => setIsLogoutModalVisible(true)}
        style={{ marginTop: 'auto' }}
      >
        <NText
          variant="sb14"
          style={{
            color: typoColorRed,
            marginBottom: spacingSpacing12 + insets.bottom,
            textAlign: 'center',
          }}
        >
          로그아웃
        </NText>
      </Pressable>
      <LogoutModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleLogout}
      />
    </PageLayout>
  );
}
