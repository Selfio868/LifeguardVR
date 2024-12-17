import { create } from 'zustand';
import type { Scenario } from '../types';

interface ScenarioState {
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  setCurrentScenario: (scenario: Scenario) => void;
  addScenario: (scenario: Scenario) => void;
}

export const useScenarioStore = create<ScenarioState>((set) => ({
  scenarios: [],
  currentScenario: null,
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),
  addScenario: (scenario) =>
    set((state) => ({
      scenarios: [...state.scenarios, scenario]
    }))
}));