import { create } from 'zustand';
import type { RescueEquipment, RopePhysics, FloatationPhysics } from '../types/equipment';

interface EquipmentState {
  equipment: RescueEquipment[];
  ropePhysics: Record<string, RopePhysics>;
  floatationPhysics: Record<string, FloatationPhysics>;
  addEquipment: (equipment: RescueEquipment) => void;
  updateEquipmentPosition: (id: string, position: [number, number, number]) => void;
  grabEquipment: (id: string) => void;
  releaseEquipment: (id: string) => void;
  attachEquipment: (id: string, attachPoint: [number, number, number]) => void;
  updatePhysics: (deltaTime: number) => void;
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipment: [],
  ropePhysics: {},
  floatationPhysics: {},

  addEquipment: (equipment) =>
    set((state) => ({
      equipment: [...state.equipment, equipment],
      ...(equipment.type === 'throwRope' && {
        ropePhysics: {
          ...state.ropePhysics,
          [equipment.id]: {
            segments: 10,
            points: Array(10).fill([0, 0, 0]),
            tension: 0.8,
            length: 15,
          },
        },
      }),
      ...(['rescueTube', 'lifeRing'].includes(equipment.type) && {
        floatationPhysics: {
          ...state.floatationPhysics,
          [equipment.id]: {
            buoyancy: equipment.type === 'rescueTube' ? 100 : 150,
            dragCoefficient: equipment.type === 'rescueTube' ? 0.3 : 0.5,
            maxLoad: equipment.type === 'rescueTube' ? 80 : 120,
            currentLoad: 0,
          },
        },
      }),
    })),

  updateEquipmentPosition: (id, position) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, position } : eq
      ),
    })),

  grabEquipment: (id) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, isGrabbed: true } : eq
      ),
    })),

  releaseEquipment: (id) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, isGrabbed: false } : eq
      ),
    })),

  attachEquipment: (id, attachPoint) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, isAttached: true, attachPoint } : eq
      ),
    })),

  updatePhysics: (deltaTime) =>
    set((state) => {
      const waterDensity = 1000; // kg/m³
      const gravity = [0, -9.81, 0];

      const updatedEquipment = state.equipment.map((eq) => {
        if (eq.isGrabbed || eq.isAttached) return eq;

        const floatation = state.floatationPhysics[eq.id];
        if (floatation) {
          // Apply buoyancy and drag forces
          const depth = Math.max(0, -eq.position[1]);
          const buoyancyForce = [
            0,
            floatation.buoyancy * depth * waterDensity,
            0,
          ];
          
          const dragForce = eq.velocity.map((v) => 
            -v * floatation.dragCoefficient * waterDensity
          ) as [number, number, number];

          // Update velocity and position
          const newVelocity: [number, number, number] = [
            eq.velocity[0] + (buoyancyForce[0] + dragForce[0] + gravity[0]) * deltaTime,
            eq.velocity[1] + (buoyancyForce[1] + dragForce[1] + gravity[1]) * deltaTime,
            eq.velocity[2] + (buoyancyForce[2] + dragForce[2] + gravity[2]) * deltaTime,
          ];

          const newPosition: [number, number, number] = [
            eq.position[0] + newVelocity[0] * deltaTime,
            eq.position[1] + newVelocity[1] * deltaTime,
            eq.position[2] + newVelocity[2] * deltaTime,
          ];

          return { ...eq, position: newPosition, velocity: newVelocity };
        }

        return eq;
      });

      // Update rope physics
      const updatedRopePhysics = { ...state.ropePhysics };
      Object.entries(state.ropePhysics).forEach(([id, rope]) => {
        const equipment = updatedEquipment.find((eq) => eq.id === id);
        if (!equipment) return;

        // Simple verlet integration for rope simulation
        const newPoints = rope.points.map((point, i) => {
          if (i === 0) return equipment.position;
          if (i === rope.points.length - 1 && equipment.isAttached) {
            return equipment.attachPoint!;
          }

          const prev = rope.points[i - 1];
          const dx = point[0] - prev[0];
          const dy = point[1] - prev[1];
          const dz = point[2] - prev[2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const tension = (distance - rope.length / rope.segments) * rope.tension;

          return [
            point[0] - dx * tension,
            point[1] - dy * tension,
            point[2] - dz * tension,
          ] as [number, number, number];
        });

        updatedRopePhysics[id] = { ...rope, points: newPoints };
      });

      return {
        equipment: updatedEquipment,
        ropePhysics: updatedRopePhysics,
      };
    }),
}));