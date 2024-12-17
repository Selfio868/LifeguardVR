import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useRescuePhysicsStore } from '../store/rescuePhysicsStore';
import { useVictimStore } from '../store/victimStore';
import { useEquipmentStore } from '../store/equipmentStore';
import * as THREE from 'three';

export function SceneContent() {
  const { camera, raycaster, scene } = useThree();
  const { startGrabbing, stopGrabbing, updateRescuerPosition } = useRescuePhysicsStore();
  const { setState } = useVictimStore();
  const { grabEquipment, releaseEquipment } = useEquipmentStore();
  
  useEffect(() => {
    let isMouseDown = false;
    let selectedObject: string | null = null;
    let hoveredObject: string | null = null;
    camera.target = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        const rotationSpeed = 0.005;
        camera.rotation.y -= e.movementX * rotationSpeed;
        camera.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, camera.rotation.x - e.movementY * rotationSpeed)
        );
      }

      // Update raycaster for object highlighting and hover
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      const clickableIntersect = intersects.find(intersect => {
        const userData = intersect.object.userData;
        return userData.type && userData.type !== 'water' && userData.type !== 'sky';
      });

      // Handle hover state changes
      const newHoveredObject = clickableIntersect?.object.userData.type || null;
      if (newHoveredObject !== hoveredObject) {
        hoveredObject = newHoveredObject;
        window.dispatchEvent(new CustomEvent('objecthover', {
          detail: { objectId: hoveredObject }
        }));
      }

      document.body.style.cursor = clickableIntersect ? 'pointer' : 'default';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 0.5;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

      switch (e.key.toLowerCase()) {
        case 'w':
          camera.position.addScaledVector(forward, speed);
          break;
        case 's':
          camera.position.addScaledVector(forward, -speed);
          break;
        case 'a':
          camera.position.addScaledVector(right, -speed);
          break;
        case 'd':
          camera.position.addScaledVector(right, speed);
          break;
        case 'q':
          camera.position.y += speed;
          break;
        case 'e':
          camera.position.y -= speed;
          break;
        case 'r':
          camera.position.set(0, 5, 10);
          camera.rotation.set(0, 0, 0);
          break;
      }
      updateRescuerPosition([camera.position.x, camera.position.y, camera.position.z]);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.001;
      // Invert the zoom delta for more intuitive zoom direction
      const zoomDelta = -e.deltaY * zoomSpeed;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(forward, zoomDelta);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click
        isMouseDown = true;
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera, raycaster, scene, updateRescuerPosition]);

  return null;
}