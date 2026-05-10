import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/features/auth/services/auth.service";

type UserState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "loopkit-user",
    },
  ),
);
