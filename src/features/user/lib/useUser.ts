import { User } from '@/src/entities/user/user';
import { create } from 'zustand';

type UserStoreState = User;

type UserStoreActions = {
  setUser: (user: User) => void;
  setName: (nextName: string) => void;
  setBirthDate: (nextBirthDate: string) => void;
};

type UserStore = UserStoreState & UserStoreActions;

const useUser = create<UserStore>((set) => ({
  id: '',
  name: '',
  email: '',
  birthDate: '',
  setUser: (nextUser) => set((state) => ({ ...state, ...nextUser })),
  setName: (nextName) => set((state) => ({ ...state, name: nextName })),
  setBirthDate: (nextBirthDate) =>
    set((state) => ({ ...state, birthDate: nextBirthDate })),
}));

export default useUser;
