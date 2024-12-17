import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVictimStore } from '../../store/victimStore';
import { VictimBasicModel } from './VictimBasicModel';

export function VictimModel({ position = [0, 0, -5] }) {
  const groupRef = useRef();
  const { behavior, animation } = useVictimStore();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Base vertical position from animation state
    let baseY = animation.verticalPosition;

    // Adjust submersion levels based on drowning stages
    if (behavior.state === 'active_swimming') {
      baseY = -0.3; // Partially submerged during normal swimming
    } else if (behavior.state === 'distressed') {
      // Rapid vertical movement with deeper base position
      const verticalMovement = Math.sin(state.clock.elapsedTime * 3) * 0.4;
      const randomJitter = (Math.sin(state.clock.elapsedTime * 5) * 0.1);
      baseY = -0.5 + verticalMovement + randomJitter; // More submerged during distress
    } else if (behavior.state === 'drowning_active') {
      // Deeper submersion with struggling
      const struggle = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      baseY = -0.7 + struggle; // Even more submerged during active drowning
    } else if (behavior.state === 'drowning_passive') {
      // Mostly submerged with slight movement
      baseY = -0.9 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    } else if (behavior.state === 'submerged' || behavior.state === 'unconscious') {
      // Fully submerged
      baseY = -1.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }

    // Update position
    groupRef.current.position.y = baseY;
    groupRef.current.position.x = position[0];
    groupRef.current.position.z = position[2];

    // Add panic-based rotation for distressed and active drowning states
    if (behavior.state === 'distressed' || behavior.state === 'drowning_active') {
      const panicRotation = Math.sin(state.clock.elapsedTime * 2) * animation.struggling * 0.2;
      groupRef.current.rotation.z = panicRotation;
    }
  });

  return (
    <group ref={groupRef} position={position} userData={{ type: 'victim' }}>
      <VictimBasicModel />
    </group>
  );
}