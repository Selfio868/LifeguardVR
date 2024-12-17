import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useEquipmentStore } from '../../store/equipmentStore';

interface RopeRendererProps {
  equipmentId: string;
}

export function RopeRenderer({ equipmentId }: RopeRendererProps) {
  const ropeRef = useRef();
  const ropePhysics = useEquipmentStore((state) => state.ropePhysics[equipmentId]);

  useFrame(() => {
    if (!ropePhysics || !ropeRef.current) return;
    ropeRef.current.geometry.setPositions(ropePhysics.points.flat());
  });

  if (!ropePhysics) return null;

  return (
    <Line
      ref={ropeRef}
      points={ropePhysics.points}
      color="#888888"
      lineWidth={2}
    />
  );
}