import { View } from 'react-native';

import InviteCodeWidget from '@/src/widgets/store/InviteCodeWidget';
import StoreInfoBtn from '@/src/widgets/store/StoreInfoBtn';

export default function HomePage() {
  return (
    <View>
      <StoreInfoBtn />
      <InviteCodeWidget />
    </View>
  );
}
