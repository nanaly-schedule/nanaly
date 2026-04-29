import { create } from 'zustand';

import { User } from '@/src/entities/user/user';

import { clearTokens } from '../../auth/lib/storage';

type UserStoreState = User;

type UserStoreActions = {
  setUser: (user: User) => void;
  setName: (nextName: string) => void;
  setBirthDate: (nextBirthDate: string) => void;
  clearUser: () => void;
};

type UserStore = UserStoreState & UserStoreActions;

const useUser = create<UserStore>((set) => ({
  isTempPassword: false,
  name: '',
  email: '',
  birthDate: '',

  setUser: (nextUser) => set((state) => ({ ...state, ...nextUser })),
  setName: (nextName) => set((state) => ({ ...state, name: nextName })),
  setBirthDate: (nextBirthDate) =>
    set((state) => ({ ...state, birthDate: nextBirthDate })),
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
