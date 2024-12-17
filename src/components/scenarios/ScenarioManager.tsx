import { useState, useEffect } from 'react';
import { useScenarioStore } from '../../store/scenarioStore';
import { useUserStore } from '../../store/userStore';
import type { Scenario } from '../../types';

export function ScenarioManager() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const updateProgress = useUserStore((state) => state.updateProgress);
  const scenarios = useScenarioStore((state) => state.scenarios);

  useEffect(() => {
    if (scenarios.length > 0) {
      setCurrentScenario(scenarios[0]);
    }
  }, [scenarios]);

  const handleScenarioComplete = () => {
    if (currentScenario) {
      updateProgress(currentScenario.id);
    }
  };

  return null; // Renders no UI, manages scenario logic
}