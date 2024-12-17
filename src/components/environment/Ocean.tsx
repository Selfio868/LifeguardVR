import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEnvironmentStore } from '../../store/environmentStore';

export function Ocean() {
  const meshRef = useRef();
  const { waterPhysics } = useEnvironmentStore();
  
  const geometry = useMemo(() => new THREE.PlaneGeometry(1000, 1000, 128, 128), []);
  const waterShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uDepthColor: { value: new THREE.Color('#006994') },
      uSurfaceColor: { value: new THREE.Color('#89CFF0') },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 5 }
    },
    vertexShader: `
      uniform float uTime;
      varying float vElevation;
      varying vec2 vUv;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Gentle rolling waves
        float elevation = 
          sin(modelPosition.x * 0.05 + uTime * 0.05) * 
          cos(modelPosition.z * 0.05 + uTime * 0.05) * 
          0.1;

        // Add very subtle secondary waves
        elevation += 
          sin(modelPosition.x * 0.1 + uTime * 0.08) * 
          cos(modelPosition.z * 0.1) * 
          0.05;

        modelPosition.y += elevation;
        vElevation = elevation;
        vUv = uv;

        gl_Position = projectionMatrix * viewMatrix * modelPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uDepthColor;
      uniform vec3 uSurfaceColor;
      uniform float uColorOffset;
      uniform float uColorMultiplier;

      varying float vElevation;
      varying vec2 vUv;

      void main() {
        float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
        vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
        
        // Add subtle horizontal bands for a more water-like appearance
        float bands = smoothstep(0.3, 0.7, sin(vUv.y * 100.0)) * 0.1;
        color += bands;

        gl_FragColor = vec4(color, 0.9);
      }
    `
  }), [waterPhysics]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
    >
      <shaderMaterial
        attach="material"
        {...waterShader}
        transparent
        side={THREE.DoubleSide}
      />
      <primitive object={geometry} />
    </mesh>
  );
}