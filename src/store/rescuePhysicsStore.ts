import { create } from 'zustand';
import type { PhysicsObject, RescuePhysicsState } from '../types/physics';
import { calculateDragForce, calculateBuoyancy } from '../utils/physicsCalculations';

interface RescuePhysicsStore {
  rescuer: PhysicsObject;
  victim: PhysicsObject;
  rescueState: RescuePhysicsState;
  updateRescuerPosition: (position: [number, number, number]) => void;
  updateVictimPosition: (position: [number, number, number]) => void;
  startGrabbing: (grabPointIndex: number, grabberPosition: [number, number, number]) => void;
  stopGrabbing: (grabPointIndex: number) => void;
  updatePhysics: (deltaTime: number) => void;
}

const INITIAL_STATE: RescuePhysicsState = {
  isGrabbing: false,
  grabPoints: [
    { position: [0.4, 0, 0], isGrabbed: false, grabberPosition: null }, // Right arm
    { position: [-0.4, 0, 0], isGrabbed: false, grabberPosition: null }, // Left arm
    { position: [0, 0.5, 0], isGrabbed: false, grabberPosition: null }, // Torso
  ],
  dragForce: 0,
  buoyancyForce: 0,
};

export const useRescuePhysicsStore = create<RescuePhysicsStore>((set, get) => ({
  rescuer: {
    position: [0, 0, 0],
    velocity: [0, 0, 0],
    mass: 70, // kg
    radius: 0.5, // meters
  },
  victim: {
    position: [0, 0, -5],
    velocity: [0, 0, 0],
    mass: 60, // kg
    radius: 0.4, // meters
  },
  rescueState: INITIAL_STATE,

  updateRescuerPosition: (position) =>
    set((state) => ({
      rescuer: { ...state.rescuer, position },
    })),

  updateVictimPosition: (position) =>
    set((state) => ({
      victim: { ...state.victim, position },
    })),

  startGrabbing: (grabPointIndex, grabberPosition) =>
    set((state) => ({
      rescueState: {
        ...state.rescueState,
        isGrabbing: true,
        grabPoints: state.rescueState.grabPoints.map((point, index) =>
          index === grabPointIndex
            ? { ...point, isGrabbed: true, grabberPosition }
            : point
        ),
      },
    })),

  stopGrabbing: (grabPointIndex) =>
    set((state) => ({
      rescueState: {
        ...state.rescueState,
        grabPoints: state.rescueState.grabPoints.map((point, index) =>
          index === grabPointIndex
            ? { ...point, isGrabbed: false, grabberPosition: null }
            : point
        ),
      },
    })),

  updatePhysics: (deltaTime) =>
    set((state) => {
      const { rescuer, victim, rescueState } = state;
      const waterDensity = 1000; // kg/m³

      // Calculate forces
      const dragForce = calculateDragForce(victim.velocity, waterDensity);
      const buoyancyForce = calculateBuoyancy(victim.mass, waterDensity);

      // Update positions and velocities based on forces
      const newVictimPosition: [number, number, number] = [
        victim.position[0],
        victim.position[1] + buoyancyForce * deltaTime,
        victim.position[2],
      ];

      return {
        victim: {
          ...victim,
          position: newVictimPosition,
        },
        rescueState: {
          ...rescueState,
          dragForce,
          buoyancyForce,
        },
      };
    }),
}));