import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TrainingEnvironment } from '../../types';

interface SkyBoxProps {
  time: TrainingEnvironment['weather']['time'];
  weather: TrainingEnvironment['weather'];
}

export function SkyBox({ time = 'day', weather }: SkyBoxProps) {
  const meshRef = useRef();

  // Create dynamic sky colors based on time and weather using useMemo
  const skyColors = useMemo(() => {
    const baseColors = {
      day: {
        top: new THREE.Color('#1e90ff'),
        middle: new THREE.Color('#87ceeb'),
        bottom: new THREE.Color('#b0e2ff'),
      },
      night: {
        top: new THREE.Color('#000033'),
        middle: new THREE.Color('#000066'),
        bottom: new THREE.Color('#000099'),
      },
    };

    const colors = { ...baseColors[time] };

    // Adjust colors based on weather conditions
    if (weather?.conditions === 'cloudy') {
      colors.top.lerp(new THREE.Color('#808080'), 0.5);
      colors.middle.lerp(new THREE.Color('#a0a0a0'), 0.5);
      colors.bottom.lerp(new THREE.Color('#c0c0c0'), 0.5);
    } else if (weather?.conditions === 'stormy') {
      colors.top.lerp(new THREE.Color('#4a4a4a'), 0.7);
      colors.middle.lerp(new THREE.Color('#696969'), 0.7);
      colors.bottom.lerp(new THREE.Color('#808080'), 0.7);
    }

    return colors;
  }, [time, weather?.conditions]);

  // Create sky shader with memoized uniforms
  const skyShader = useMemo(() => ({
    uniforms: {
      topColor: { value: skyColors.top },
      middleColor: { value: skyColors.middle },
      bottomColor: { value: skyColors.bottom },
      offset: { value: 33 },
      exponent: { value: 0.6 },
      time: { value: 0 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 middleColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      uniform float time;
      
      varying vec3 vWorldPosition;
      
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        float t = max(0.0, min(1.0, pow(max(0.0, h), exponent)));
        
        vec3 sky = mix(bottomColor, middleColor, h);
        sky = mix(sky, topColor, t);
        
        // Add subtle color variation for clouds
        float noise = fract(sin(dot(vWorldPosition.xz, vec2(12.9898, 78.233))) * 43758.5453123);
        noise = noise * 0.1 + 0.9;
        
        gl_FragColor = vec4(sky * noise, 1.0);
      }
    `,
  }), [skyColors]);

  useFrame((state) => {
    if (!meshRef.current?.material?.uniforms) return;

    meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 32, 32]} />
      <shaderMaterial
        attach="material"
        args={[skyShader]}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}