import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const WaterSimulation = forwardRef((props, ref) => {
  const meshRef = useRef();
  const waterGeometry = new THREE.PlaneGeometry(100, 100, 128, 128);
  
  useFrame((state, delta) => {
    // Simulate water movement
    const positions = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] = Math.sin(positions[i] + state.clock.elapsedTime) * 0.3;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
    >
      <primitive object={waterGeometry} />
      <meshStandardMaterial
        color="#006994"
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
});