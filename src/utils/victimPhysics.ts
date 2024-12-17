import type { VictimState } from '../types/victim';
import type { TrainingEnvironment } from '../types';

const DROWNING_PHYSICS = {
  active_swimming: {
    buoyancy: 1.0,
    drag: 0.3,
    turbulence: 0.1
  },
  distressed: {
    buoyancy: 0.8,
    drag: 0.5,
    turbulence: 0.3
  },
  drowning_active: {
    buoyancy: 0.6,
    drag: 0.7,
    turbulence: 0.5
  },
  drowning_passive: {
    buoyancy: 0.4,
    drag: 0.8,
    turbulence: 0.2
  },
  submerged: {
    buoyancy: 0.2,
    drag: 0.9,
    turbulence: 0.1
  },
  unconscious: {
    buoyancy: 0.3,
    drag: 0.8,
    turbulence: 0.1
  }
};

export function applyVictimPhysics(
  position: [number, number, number],
  waterPhysics: TrainingEnvironment['waterPhysics'],
  state: VictimState,
  deltaTime: number
): [number, number, number] {
  const [x, y, z] = position;
  const physics = DROWNING_PHYSICS[state];
  
  // Apply water current
  const currentForce = waterPhysics.currentStrength * deltaTime * (1 - physics.drag);
  const newX = x + currentForce;
  
  // Calculate vertical position based on buoyancy and state
  let newY = y;
  const buoyancyForce = physics.buoyancy * (1 - y * 0.5); // Decreases with depth
  const gravityForce = 0.98 * deltaTime;
  
  newY += (buoyancyForce - gravityForce) * deltaTime;
  
  // Add turbulence
  const turbulence = Math.sin(Date.now() * 0.001) * physics.turbulence;
  newY += turbulence * deltaTime;
  
  // Apply wave effect
  const waveEffect = Math.sin(x * 0.5 + Date.now() * 0.001) * waterPhysics.waveHeight;
  newY += waveEffect * (1 - physics.drag);
  
  // Clamp vertical position
  newY = Math.max(-2, Math.min(0.5, newY));
  
  return [newX, newY, z];
}