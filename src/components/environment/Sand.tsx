import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Sand() {
  const meshRef = useRef();
  
  // Create a detailed sand geometry with slight variations
  const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128);
  const vertices = geometry.attributes.position.array;
  
  // Add subtle height variations to create a more realistic sand surface
  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 1] = Math.random() * 0.2 - 0.1;
  }
  
  // Create a realistic sand material
  const sandMaterial = new THREE.MeshStandardMaterial({
    color: '#e6d5ac',
    roughness: 1,
    metalness: 0,
    flatShading: true,
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Subtle sand movement simulation
      const time = state.clock.getElapsedTime();
      const vertices = meshRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 1] = Math.sin(vertices[i] * 0.05 + time * 0.1) * 0.05;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      <primitive object={geometry} />
      <primitive object={sandMaterial} attach="material" />
    </mesh>
  );
}