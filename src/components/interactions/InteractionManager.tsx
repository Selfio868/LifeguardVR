import { useEffect } from 'react';
import { useXR, Interactive } from '@react-three/xr';
import { useRescuePhysicsStore } from '../../store/rescuePhysicsStore';
import { useVictimStore } from '../../store/victimStore';
import { useEquipmentStore } from '../../store/equipmentStore';

export function InteractionManager() {
  const { isPresenting } = useXR();
  const { startGrabbing, stopGrabbing } = useRescuePhysicsStore();
  const { behavior, setState } = useVictimStore();
  const { grabEquipment, releaseEquipment } = useEquipmentStore();

  const handleGrab = (controller, intersect) => {
    const distance = intersect.distance;
    
    if (distance < 0.5) { // Within grab range
      if (intersect.object.userData.type === 'victim') {
        const grabPoint = Math.floor(Math.random() * 3); // Simplified grab point selection
        startGrabbing(grabPoint, controller.controller.position.toArray());
        setState('conscious'); // Reset victim state when grabbed
      } else if (intersect.object.userData.type === 'equipment') {
        grabEquipment(intersect.object.userData.id);
      }
    }
  };

  const handleRelease = (controller, intersect) => {
    if (intersect.object.userData.type === 'victim') {
      stopGrabbing(0); // Release all grab points
    } else if (intersect.object.userData.type === 'equipment') {
      releaseEquipment(intersect.object.userData.id);
    }
  };

  return null; // This component handles interactions but doesn't render anything
}