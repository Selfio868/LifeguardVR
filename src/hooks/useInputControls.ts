import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useRescuePhysicsStore } from '../store/rescuePhysicsStore';
import { useVictimStore } from '../store/victimStore';
import { useEquipmentStore } from '../store/equipmentStore';

export function useInputControls() {
  const { camera } = useThree();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const { startGrabbing, stopGrabbing, updateRescuerPosition } = useRescuePhysicsStore();
  const { setState } = useVictimStore();
  const { grabEquipment, releaseEquipment } = useEquipmentStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 0.5;
      switch (e.key.toLowerCase()) {
        case 'w':
          camera.position.z -= speed;
          break;
        case 's':
          camera.position.z += speed;
          break;
        case 'a':
          camera.position.x -= speed;
          break;
        case 'd':
          camera.position.x += speed;
          break;
        case 'q':
          camera.position.y += speed;
          break;
        case 'e':
          camera.position.y -= speed;
          break;
        case 'r':
          // Reset camera position
          camera.position.set(0, 5, 10);
          camera.lookAt(0, 0, 0);
          break;
        case ' ':
          // Space to interact with selected object
          if (selectedObject) {
            if (selectedObject === 'victim') {
              startGrabbing(0, [camera.position.x, camera.position.y, camera.position.z]);
              setState('conscious');
            } else {
              grabEquipment(selectedObject);
            }
          }
          break;
      }
      updateRescuerPosition([camera.position.x, camera.position.y, camera.position.z]);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        const rotationSpeed = 0.005;
        camera.rotation.y -= e.movementX * rotationSpeed;
        camera.rotation.x -= e.movementY * rotationSpeed;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.001;
      const zoomDelta = e.deltaY * zoomSpeed;
      const minDistance = 2;
      const maxDistance = 20;
      
      // Calculate new camera position
      const direction = camera.position.clone().sub(camera.target || new THREE.Vector3());
      const distance = direction.length();
      const newDistance = Math.max(minDistance, Math.min(maxDistance, distance + zoomDelta));
      
      direction.normalize().multiplyScalar(newDistance);
      camera.position.copy(direction.add(camera.target || new THREE.Vector3()));
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => {
      setIsMouseDown(false);
      if (selectedObject) {
        if (selectedObject === 'victim') {
          stopGrabbing(0);
        } else {
          releaseEquipment(selectedObject);
        }
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera, isMouseDown, selectedObject]);

  return { setSelectedObject };
}