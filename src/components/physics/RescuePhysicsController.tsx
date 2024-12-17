import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR, XRController } from '@react-three/xr';
import { useRescuePhysicsStore } from '../../store/rescuePhysicsStore';
import { calculateGrabForce } from '../../utils/physicsCalculations';

export function RescuePhysicsController() {
  const { isPresenting } = useXR();
  const rightController = useRef<XRController>();
  const leftController = useRef<XRController>();
  
  const {
    rescuer,
    victim,
    rescueState,
    updateRescuerPosition,
    startGrabbing,
    stopGrabbing,
    updatePhysics,
  } = useRescuePhysicsStore();

  useFrame((state, deltaTime) => {
    if (!isPresenting) return;

    // Update physics simulation
    updatePhysics(deltaTime);

    // Handle controller interactions
    if (rightController.current) {
      const controllerPosition = rightController.current.controller.position.toArray() as [number, number, number];
      
      // Check for grab point proximity
      rescueState.grabPoints.forEach((point, index) => {
        const distance = Math.sqrt(
          Math.pow(controllerPosition[0] - (victim.position[0] + point.position[0]), 2) +
          Math.pow(controllerPosition[1] - (victim.position[1] + point.position[1]), 2) +
          Math.pow(controllerPosition[2] - (victim.position[2] + point.position[2]), 2)
        );

        if (distance < 0.2 && rightController.current?.inputSource?.gamepad?.buttons[0].pressed) {
          startGrabbing(index, controllerPosition);
        }
      });
    }
  });

  useEffect(() => {
    const handleControllerConnected = (e: any) => {
      if (e.data.handedness === 'right') {
        rightController.current = e.target;
      } else {
        leftController.current = e.target;
      }
    };

    return () => {
      rightController.current = undefined;
      leftController.current = undefined;
    };
  }, []);

  return null;
}