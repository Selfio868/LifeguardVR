import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVictimStore } from '../../store/victimStore';
import { DROWNING_CHARACTERISTICS } from '../../types/victim';
import * as THREE from 'three';

export function VictimBasicModel() {
  const bodyRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const legsRef = useRef();
  
  const { behavior, animation } = useVictimStore();
  
  useFrame((state) => {
    if (!bodyRef.current) return;
    
    const characteristics = DROWNING_CHARACTERISTICS[behavior.state];
    const timeInState = (Date.now() - behavior.lastStateChange) / 1000;
    
    // Update body position based on state
    switch (behavior.state) {
      case 'active_swimming':
        // Smooth swimming motion
        const swimCycle = state.clock.elapsedTime * 2;
        // Body follows a gentle wave pattern
        bodyRef.current.rotation.x = Math.sin(swimCycle * 0.5) * 0.15;
        // Add slight side-to-side motion
        bodyRef.current.rotation.z = Math.sin(swimCycle * 0.25) * 0.05;
        // Head stays relatively level but follows body motion
        headRef.current.rotation.x = -bodyRef.current.rotation.x * 0.5;
        // Add slight horizontal movement
        bodyRef.current.position.x = Math.sin(swimCycle * 0.3) * 0.2;
        break;
      case 'distressed':
        // Almost vertical position with slight tilt
        bodyRef.current.rotation.x = 0.2;
        bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
        headRef.current.rotation.x = -0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
        break;
      case 'drowning_active':
        bodyRef.current.rotation.x = 0.1;
        headRef.current.rotation.x = -0.6;
        break;
      case 'drowning_passive':
        bodyRef.current.rotation.x = -0.3;
        headRef.current.rotation.x = 0.2;
        break;
      case 'submerged':
        bodyRef.current.rotation.x = -0.5;
        headRef.current.rotation.x = 0;
        break;
      case 'unconscious':
        bodyRef.current.rotation.x = Math.PI / 2;
        headRef.current.rotation.x = 0.3;
        break;
    }
    
    // Enhanced arm animations based on state
    if (behavior.state === 'active_swimming') {
      // Coordinated swimming arm movements
      const armCycle = state.clock.elapsedTime * 2;
      // Forward stroke
      leftArmRef.current.rotation.x = Math.sin(armCycle) * 1.2;
      rightArmRef.current.rotation.x = Math.sin(armCycle + Math.PI) * 1.2;
      // Side motion during recovery
      leftArmRef.current.rotation.z = Math.cos(armCycle) * 0.3;
      rightArmRef.current.rotation.z = Math.cos(armCycle + Math.PI) * 0.3;
    } else if (behavior.state === 'distressed') {
      // Rapid, uncoordinated arm movements
      const franticSpeed = 8;
      const randomOffset = Math.sin(state.clock.elapsedTime * 5) * 0.2;
      leftArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * franticSpeed) * 1.2 + randomOffset;
      leftArmRef.current.rotation.z = Math.cos(state.clock.elapsedTime * franticSpeed * 0.7) * 0.5;
      rightArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * franticSpeed + Math.PI) * 1.2 - randomOffset;
      rightArmRef.current.rotation.z = Math.cos(state.clock.elapsedTime * franticSpeed * 0.7 + Math.PI) * 0.5;
    } else if (behavior.state === 'drowning_active') {
      // Ladder climbing motion
      const climbSpeed = 4;
      leftArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * climbSpeed) * 1.2;
      rightArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * climbSpeed + Math.PI) * 1.2;
    } else {
      // Minimal or no movement for other states
      leftArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      rightArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    
    // Update leg movement
    if (behavior.state === 'active_swimming') {
      // Coordinated kick motion
      const kickCycle = state.clock.elapsedTime * 3;
      legsRef.current.rotation.x = Math.sin(kickCycle) * 0.5;
      // Add slight sideways motion
      legsRef.current.rotation.z = Math.sin(kickCycle * 0.5) * 0.1;
    } else if (behavior.state === 'distressed') {
      // Vertical kicking motion
      legsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 6) * 0.8;
      legsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.2;
    } else {
      legsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Torso */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      
      {/* Head */}
      <group ref={headRef} position={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
      </group>
      
      {/* Arms */}
      <group ref={leftArmRef} position={[0.25, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
      </group>
      
      <group ref={rightArmRef} position={[-0.25, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
      </group>
      
      {/* Legs */}
      <group ref={legsRef} position={[0, -0.4, 0]}>
        <mesh position={[0.1, -0.2, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
        <mesh position={[-0.1, -0.2, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
      </group>
    </group>
  );
}