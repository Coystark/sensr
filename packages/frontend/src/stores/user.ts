import create from "zustand";
import { persist } from "zustand/middleware";

type IUser = { [key: string]: any };

interface IUserStore {
  user: IUser;
  isAuthenticated: boolean;
  setUser: (data: IUser) => void;
  signOut: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null!,
      isAuthenticated: false,
      setUser: (data) => {
        set({ user: data, isAuthenticated: true });
      },
      signOut: () => set({ user: null!, isAuthenticated: false }),
    }),
    {
      name: "user",
      getStorage: () => localStorage,
    }
  )
);
