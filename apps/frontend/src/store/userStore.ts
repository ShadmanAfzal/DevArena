import { create } from "zustand";
import { logoutUser } from "../api/auth";

export type User = {
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  profilePicture: string;
  lastActive: string;
};

type UserStoreType = {
  isLoggedIn: boolean;
  user?: User;
  setUser: (user: User) => void;
  signOut: () => void;
};

export const useUserStore = create<UserStoreType>((set) => {
  return {
    isLoggedIn: false,
    setUser: (user) => {
      set({
        user,
        isLoggedIn: true,
      });
    },
    signOut: async () => {
      const isLoggedOut = await logoutUser();

      if (isLoggedOut) {
        set({
          user: undefined,
          isLoggedIn: false,
        });
      }
    },
  };
});
