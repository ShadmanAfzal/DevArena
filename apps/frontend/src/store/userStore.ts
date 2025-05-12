import { create } from "zustand";

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
  };
});
