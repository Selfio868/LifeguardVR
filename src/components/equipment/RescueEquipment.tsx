import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';
import { useEquipmentStore } from '../../store/equipmentStore';
import { BasicModel } from '../models/BasicModels';
import type { EquipmentType } from '../../types/equipment';

interface RescueEquipmentProps {
  type: EquipmentType;
  initialPosition: [number, number, number];
}

export function RescueEquipment({ type, initialPosition }: RescueEquipmentProps) {
  const meshRef = useRef();
  const id = useRef(Math.random().toString(36).substr(2, 9));
  const { addEquipment, updatePhysics } = useEquipmentStore();

  useEffect(() => {
    addEquipment({
      id: id.current,
      type,
      position: initialPosition,
      rotation: [0, 0, 0],
      velocity: [0, 0, 0],
      isGrabbed: false,
      isAttached: false,
    });
  }, []);

  useFrame((state, deltaTime) => {
    updatePhysics(deltaTime);
  });

  return (
    <Interactive onSelect={(e) => console.log('Equipment selected', e)}>
      <group 
        ref={meshRef} 
        position={initialPosition}
        userData={{ type: 'equipment', id: id.current }}
      >
        <BasicModel type={type} />
      </group>
    </Interactive>
  );
}