import { create } from 'zustand';
import type { User } from '../types';

interface UserState {
  currentUser: User | null;
  setUser: (user: User) => void;
  updateProgress: (scenarioId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setUser: (user) => set({ currentUser: user }),
  updateProgress: (scenarioId) =>
    set((state) => ({
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            progress: {
              ...state.currentUser.progress,
              completedScenarios: [...state.currentUser.progress.completedScenarios, scenarioId],
            },
          }
        : null,
    })),
}));