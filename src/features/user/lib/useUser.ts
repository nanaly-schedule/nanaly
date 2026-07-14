import * as Sentry from '@sentry/react-native';
import { create } from 'zustand';

import { User } from '@/src/entities/user/user';
import { unregisterCurrentDeviceAsync } from '@/src/features/push/lib/pushNotification';

import { clearTokens } from '../../auth/lib/storage';

type UserStoreState = User;

type UserStoreActions = {
  setUser: (user: Partial<User>) => void;
  clearUser: () => Promise<void>;
};

type UserStore = UserStoreState & UserStoreActions;

const useUser = create<UserStore>((set) => ({
  isTempPassword: false,
  name: '',
  email: '',
  birthDate: '',
  currentStoreAccessLoaded: false,
  currentStoreId: null,
  currentStoreRole: null,
  currentStorePermissions: null,

  setUser: (nextUser) => set((state) => ({ ...state, ...nextUser })),
  clearUser: async () => {
    set({
      isTempPassword: false,
      name: '',
      email: '',
      birthDate: '',
      currentStoreAccessLoaded: false,
      currentStoreId: null,
      currentStoreRole: null,
      currentStorePermissions: null,
    });
    Sentry.setUser(null);
    await unregisterCurrentDeviceAsync();
    await clearTokens();
  },
}));

export default useUser;
