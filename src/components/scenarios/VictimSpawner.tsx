import { useEffect } from 'react';
import { useVictimStore } from '../../store/victimStore';
import { useScenarioStore } from '../../store/scenarioStore';
import type { SwimSkill } from '../../types/victim';

export function VictimSpawner() {
  const { currentScenario } = useScenarioStore();
  const setState = useVictimStore((state) => state.setState);
  
  useEffect(() => {
    if (!currentScenario) return;
    
    // Configure victim based on scenario difficulty
    const swimSkills: Record<string, SwimSkill> = {
      beginner: 'none',
      intermediate: 'beginner',
      expert: 'intermediate',
    };
    
    const spawnVictim = () => {
      setState('conscious');
      useVictimStore.setState({
        behavior: {
          ...useVictimStore.getState().behavior,
          swimSkill: swimSkills[currentScenario.difficulty],
          energy: 100,
          panicLevel: 0,
          position: [0, -0.2, -5],
        },
      });
    };
    
    spawnVictim();
  }, [currentScenario]);
  
  return null;
}