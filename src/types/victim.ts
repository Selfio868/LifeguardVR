export type VictimState = 
  | 'active_swimming'    // Swimming normally
  | 'distressed'         // Beginning to struggle
  | 'drowning_active'    // Active drowning phase
  | 'drowning_passive'   // Passive drowning phase
  | 'submerged'          // Underwater
  | 'unconscious';       // Unconscious state

export type SwimSkill = 'none' | 'beginner' | 'intermediate' | 'advanced';

export interface VictimBehavior {
  state: VictimState;
  energy: number;
  swimSkill: SwimSkill;
  panicLevel: number;
  lastStateChange: number;
  position: [number, number, number];
  rotation: [number, number, number];
  oxygenLevel: number;
  timeUnderwater: number;
}

export interface VictimAnimationState {
  headTilt: number;         // Head position relative to water
  armPosition: number;      // Arm movement pattern
  legKick: number;         // Leg movement intensity
  bodyRotation: number;    // Body vertical angle
  verticalPosition: number; // Height in water
  struggling: number;      // Struggle intensity
}

export const DROWNING_CHARACTERISTICS = {
  active_swimming: {
    headPosition: 'above',
    armMovement: 'coordinated',
    legMovement: 'regular',
    bodyPosition: 'horizontal',
    description: 'Normal swimming motion'
  },
  distressed: {
    headPosition: 'tilted_back',
    armMovement: 'uncoordinated',
    legMovement: 'vertical',
    bodyPosition: 'vertical',
    description: 'Struggling to maintain position'
  },
  drowning_active: {
    headPosition: 'barely_above',
    armMovement: 'ladder_climbing',
    legMovement: 'minimal',
    bodyPosition: 'vertical',
    description: 'Instinctive drowning response'
  },
  drowning_passive: {
    headPosition: 'submerging',
    armMovement: 'limp',
    legMovement: 'none',
    bodyPosition: 'floating',
    description: 'Minimal movement, face down'
  },
  submerged: {
    headPosition: 'underwater',
    armMovement: 'none',
    legMovement: 'none',
    bodyPosition: 'sinking',
    description: 'Completely underwater'
  },
  unconscious: {
    headPosition: 'submerged',
    armMovement: 'none',
    legMovement: 'none',
    bodyPosition: 'limp',
    description: 'Unconscious state'
  }
};