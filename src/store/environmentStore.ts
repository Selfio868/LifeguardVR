import { create } from 'zustand';
import type { TrainingEnvironment } from '../types';

interface EnvironmentState extends TrainingEnvironment {
  setWeather: (weather: Partial<TrainingEnvironment['weather']>) => void;
  setWaterPhysics: (physics: Partial<TrainingEnvironment['waterPhysics']>) => void;
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  type: 'beach',
  waterPhysics: {
    waveHeight: 0.5,
    currentStrength: 0.3,
    visibility: 0.8
  },
  weather: {
    time: 'day',
    conditions: 'clear',
    windSpeed: 5
  },
  setWeather: (weather) =>
    set((state) => ({
      weather: { ...state.weather, ...weather }
    })),
  setWaterPhysics: (physics) =>
    set((state) => ({
      waterPhysics: { ...state.waterPhysics, ...physics }
    }))
}));