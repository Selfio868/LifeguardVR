import { create } from 'zustand';
import type { VictimBehavior, VictimState, VictimAnimationState } from '../types/victim';

interface VictimStore {
  behavior: VictimBehavior;
  animation: VictimAnimationState;
  setState: (state: VictimState) => void;
  updateBehavior: (deltaTime: number) => void;
  updateAnimation: (deltaTime: number) => void;
  elapsedTime: number;
  setElapsedTime: (time: number | ((prev: number) => number)) => void;
}

const INITIAL_BEHAVIOR: VictimBehavior = {
  state: 'active_swimming',
  energy: 100,
  swimSkill: 'beginner',
  panicLevel: 0,
  lastStateChange: Date.now(),
  position: [0, 0, -5],
  rotation: [0, 0, 0],
  oxygenLevel: 100,
  timeUnderwater: 0,
};

const INITIAL_ANIMATION: VictimAnimationState = {
  headTilt: 0,
  armPosition: 0,
  legKick: 0,
  bodyRotation: 0,
  verticalPosition: -0.3, // Start partially submerged
  struggling: 0,
};

const DROWNING_STAGES = [
  { 
    time: 0,
    state: 'active_swimming',
    energy: 100,
    oxygenLevel: 100,
    bodyRotation: 0,
    verticalPosition: -0.3,
  },
  { 
    time: 30,
    state: 'distressed',
    energy: 70,
    oxygenLevel: 85,
    bodyRotation: Math.PI / 4,
    verticalPosition: -0.5,
  },
  { 
    time: 60,
    state: 'drowning_active',
    energy: 40,
    oxygenLevel: 60,
    bodyRotation: Math.PI / 2,
    verticalPosition: -0.7,
  },
  { 
    time: 90,
    state: 'drowning_passive',
    energy: 20,
    oxygenLevel: 40,
    bodyRotation: -Math.PI / 6,
    verticalPosition: -0.9,
  },
  { 
    time: 120,
    state: 'submerged',
    energy: 10,
    oxygenLevel: 20,
    bodyRotation: -Math.PI / 4,
    verticalPosition: -1.2,
  },
  { 
    time: 150,
    state: 'unconscious',
    energy: 0,
    oxygenLevel: 0,
    bodyRotation: Math.PI / 2,
    verticalPosition: -1.2,
  }
] as const;

export const useVictimStore = create<VictimStore>((set) => ({
  behavior: INITIAL_BEHAVIOR,
  animation: INITIAL_ANIMATION,
  elapsedTime: 0,

  setElapsedTime: (timeOrUpdater) =>
    set((state) => {
      const newTime = typeof timeOrUpdater === 'function' 
        ? timeOrUpdater(state.elapsedTime)
        : timeOrUpdater;

      const currentStage = DROWNING_STAGES.reduce((prev, curr) => {
        return newTime >= curr.time ? curr : prev;
      }, DROWNING_STAGES[0]);

      return {
        elapsedTime: newTime,
        behavior: {
          ...state.behavior,
          state: currentStage.state as VictimState,
          energy: currentStage.energy,
          oxygenLevel: currentStage.oxygenLevel,
          lastStateChange: Date.now(),
          panicLevel: Math.min(100, (newTime / 150) * 100),
          timeUnderwater: newTime
        },
        animation: {
          ...state.animation,
          bodyRotation: currentStage.bodyRotation,
          verticalPosition: currentStage.verticalPosition,
          headTilt: currentStage.state === 'drowning_active' ? -0.5 : 
                    currentStage.state === 'drowning_passive' ? 0.2 : 0,
          struggling: currentStage.state === 'drowning_active' ? 1 :
                     currentStage.state === 'distressed' ? 0.5 : 0
        }
      };
    }),

  setState: (state: VictimState) =>
    set((store) => ({
      behavior: {
        ...store.behavior,
        state,
        lastStateChange: Date.now(),
      },
    })),

  updateBehavior: (deltaTime: number) =>
    set((store) => {
      const { behavior, elapsedTime } = store;
      
      const currentStage = DROWNING_STAGES.reduce((prev, curr) => {
        return elapsedTime >= curr.time ? curr : prev;
      }, DROWNING_STAGES[0]);

      return {
        behavior: {
          ...behavior,
          state: currentStage.state as VictimState,
          energy: currentStage.energy,
          oxygenLevel: currentStage.oxygenLevel,
          timeUnderwater: elapsedTime
        },
      };
    }),

  updateAnimation: (deltaTime: number) =>
    set((store) => {
      const { behavior } = store;
      const currentStage = DROWNING_STAGES.find(stage => stage.state === behavior.state);
      if (!currentStage) return store;
      
      return {
        animation: {
          headTilt: currentStage.state === 'drowning_active' ? -0.5 : 
                    currentStage.state === 'drowning_passive' ? 0.2 : 0,
          armPosition: Math.sin(Date.now() * 0.003) * (behavior.state === 'active_swimming' ? 1 : 0.3),
          legKick: Math.cos(Date.now() * 0.004) * (behavior.state === 'active_swimming' ? 1 : 0.2),
          bodyRotation: currentStage.bodyRotation,
          verticalPosition: currentStage.verticalPosition,
          struggling: currentStage.state === 'drowning_active' ? 1 :
                     currentStage.state === 'distressed' ? 0.5 : 0
        }
      };
    }),
}));