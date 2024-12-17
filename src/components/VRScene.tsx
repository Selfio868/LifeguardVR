import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR, Controllers, Hands } from '@react-three/xr';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { BeachEnvironment } from './environment/BeachEnvironment';
import { VictimModel } from './models/VictimModel';
import { ScenarioManager } from './scenarios/ScenarioManager';
import { RescuePhysicsController } from './physics/RescuePhysicsController';
import { InteractionManager } from './interactions/InteractionManager';
import { useEnvironmentStore } from '../store/environmentStore';
import { SceneContent } from './SceneContent';

export function VRScene() {
  const { weather } = useEnvironmentStore();
  const sceneRef = useRef();

  return (
    <>
      <VRButton />
      <Canvas>
        <SceneContent />
        <PerspectiveCamera
          makeDefault
          position={[0, 2, 3]} // Moved closer to the victim while maintaining height
          fov={75}
        />
        <XR>
          <Controllers />
          <Hands />
          <InteractionManager />
          <RescuePhysicsController />
          <Environment preset={weather.conditions === 'clear' ? 'sunset' : 'night'} />
          <BeachEnvironment />
          
          <VictimModel position={[0, 0, -2]} /> {/* Adjusted victim position to match new camera */}
          <ScenarioManager />
          
          <ambientLight intensity={weather.time === 'day' ? 0.5 : 0.2} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={weather.time === 'day' ? 1 : 0.3} 
          />
        </XR>
      </Canvas>
    </>
  );
}