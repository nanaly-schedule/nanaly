import { create } from 'zustand';

import { User } from '@/src/entities/user/user';

import { clearTokens } from '../../auth/lib/storage';

type UserStoreState = User;

type UserStoreActions = {
  setUser: (user: User) => void;
  clearUser: () => Promise<void>;
};

type UserStore = UserStoreState & UserStoreActions;

const useUser = create<UserStore>((set) => ({
  isTempPassword: false,
  name: '',
  email: '',
  birthDate: '',

  setUser: (nextUser) => set((state) => ({ ...state, ...nextUser })),
  clearUser: async () => {
    set({
      isTempPassword: false,
      name: '',
      email: '',
      birthDate: '',
    });
    await clearTokens();
  },
}));

export default useUser;
