import { useRef } from 'react';
import * as THREE from 'three';

export function BeachBackground() {
  const meshRef = useRef();
  
  // Create a large curved plane for the beach background
  const geometry = new THREE.CylinderGeometry(500, 500, 200, 64, 1, true, Math.PI * 0.25, Math.PI * 0.5);
  geometry.scale(-1, 1, 1); // Invert to show texture on inside
  
  // Beach texture coordinates
  const uvs = geometry.attributes.uv;
  for (let i = 0; i < uvs.count; i++) {
    let u = uvs.getX(i);
    let v = uvs.getY(i);
    uvs.setXY(i, u * 2, v);
  }

  const beachTexture = new THREE.TextureLoader().load(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80'
  );
  
  return (
    <mesh
      ref={meshRef}
      position={[0, 0, -250]}
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={geometry} />
      <meshBasicMaterial
        map={beachTexture}
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}