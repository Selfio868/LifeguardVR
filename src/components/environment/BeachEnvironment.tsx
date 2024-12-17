import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useEnvironmentStore } from '../../store/environmentStore';
import { Sand } from './Sand';
import { Ocean } from './Ocean';
import { SkyBox } from './SkyBox';
import { BeachBackground } from './BeachBackground';

export function BeachEnvironment() {
  const { time, weather } = useEnvironmentStore();
  const envRef = useRef();

  useFrame((state, delta) => {
    // Update environment based on time of day and weather
    if (envRef.current) {
      envRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={envRef}>
      <BeachBackground />
      <Sand />
      <Ocean />
      <SkyBox time={time} weather={weather} />
    </group>
  );
}