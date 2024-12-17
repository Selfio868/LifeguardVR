export interface User {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  progress: {
    completedScenarios: string[];
    certifications: string[];
    skillLevels: Record<string, number>;
  };
}

export interface Scenario {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  type: 'rescue' | 'cpr' | 'firstAid' | 'assessment';
  environment: 'beach' | 'pool' | 'lake';
  weatherConditions?: {
    time: 'day' | 'night';
    waves: number;
    visibility: number;
    wind: number;
  };
}

export interface TrainingEnvironment {
  type: 'beach' | 'pool' | 'lake';
  waterPhysics: {
    waveHeight: number;
    currentStrength: number;
    visibility: number;
  };
  weather: {
    time: 'day' | 'night';
    conditions: 'clear' | 'cloudy' | 'stormy';
    windSpeed: number;
  };
}