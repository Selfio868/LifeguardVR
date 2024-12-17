import { useRef } from 'react';
import { Cylinder, Torus, Box } from '@react-three/drei';
import type { EquipmentType } from '../../types/equipment';

interface BasicModelProps {
  type: EquipmentType;
  color?: string;
}

export function BasicModel({ type, color = '#ff0000' }: BasicModelProps) {
  const meshRef = useRef();

  switch (type) {
    case 'rescueTube':
      return (
        <Cylinder ref={meshRef} args={[0.1, 0.1, 1, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={color} />
        </Cylinder>
      );
    case 'throwRope':
      return (
        <Cylinder ref={meshRef} args={[0.05, 0.05, 0.3, 32]}>
          <meshStandardMaterial color="#964B00" />
        </Cylinder>
      );
    case 'lifeRing':
      return (
        <Torus ref={meshRef} args={[0.3, 0.05, 16, 32]}>
          <meshStandardMaterial color="#FFA500" />
        </Torus>
      );
    default:
      return null;
  }
}

export function VictimBasicModel() {
  return (
    <group>
      {/* Body */}
      <Box args={[0.4, 1.2, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFB6C1" />
      </Box>
      {/* Head */}
      <Box args={[0.2, 0.2, 0.2]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#FFB6C1" />
      </Box>
      {/* Arms */}
      <Box args={[0.8, 0.1, 0.1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#FFB6C1" />
      </Box>
      {/* Legs */}
      <Box args={[0.2, 0.6, 0.1]} position={[-0.1, -0.6, 0]}>
        <meshStandardMaterial color="#FFB6C1" />
      </Box>
      <Box args={[0.2, 0.6, 0.1]} position={[0.1, -0.6, 0]}>
        <meshStandardMaterial color="#FFB6C1" />
      </Box>
    </group>
  );
}