import { create } from "zustand";
import { logoutUser } from "../api/auth";

export type User = {
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  profilePicture: string;
  lastActive: string;
  isAdmin: boolean;
};

type UserStoreType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user?: User;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  signOut: () => void;
};

export const useUserStore = create<UserStoreType>((set) => {
  return {
    isLoggedIn: false,
    isLoading: true,
    setLoading: (isLoading) => set({ isLoading }),
    setUser: (user) => set({ user, isLoggedIn: true, isLoading: false }),
    signOut: async () => {
      const isLoggedOut = await logoutUser();

      if (isLoggedOut) {
        set({ user: undefined, isLoggedIn: false, isLoading: false });
      }
    },
  };
});
