import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGlobalStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (newVal) => set({isLoggedIn: newVal})
    }),
    {
      name: "global-storage",
      getStorage: () => localStorage,
    }
  ),
)

export default useGlobalStore;
