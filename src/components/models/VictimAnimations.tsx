import { useEffect } from 'react';
import { useAnimations } from '@react-three/drei';
import { VictimState } from '../../types/victim';

interface AnimationConfig {
  name: string;
  speed: number;
  blendDuration: number;
}

const ANIMATION_CONFIGS: Record<VictimState, AnimationConfig> = {
  active_swimming: {
    name: 'swimming',
    speed: 1,
    blendDuration: 0.5
  },
  distressed: {
    name: 'treading_water',
    speed: 1.2,
    blendDuration: 0.3
  },
  drowning_active: {
    name: 'drowning_active',
    speed: 1.5,
    blendDuration: 0.2
  },
  drowning_passive: {
    name: 'drowning_passive',
    speed: 0.8,
    blendDuration: 0.4
  },
  submerged: {
    name: 'sinking',
    speed: 0.6,
    blendDuration: 0.5
  },
  unconscious: {
    name: 'unconscious',
    speed: 0.3,
    blendDuration: 0.7
  }
};

export function useVictimAnimations(
  animations: THREE.AnimationClip[],
  group: THREE.Group,
  state: VictimState
) {
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions || !mixer) return;

    const config = ANIMATION_CONFIGS[state];
    const action = actions[config.name];

    if (action) {
      // Stop all current animations
      Object.values(actions).forEach(a => a?.stop());

      // Configure and play new animation
      action.reset()
        .setEffectiveTimeScale(config.speed)
        .fadeIn(config.blendDuration)
        .play();
    }

    return () => {
      action?.fadeOut(0.5);
    };
  }, [state, actions, mixer]);

  return { actions, mixer };
}