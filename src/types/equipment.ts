export type EquipmentType = 'rescueTube' | 'throwRope' | 'lifeRing';

export interface RescueEquipment {
  id: string;
  type: EquipmentType;
  position: [number, number, number];
  rotation: [number, number, number];
  velocity: [number, number, number];
  isGrabbed: boolean;
  isAttached: boolean;
  attachPoint?: [number, number, number];
}

export interface RopePhysics {
  segments: number;
  points: [number, number, number][];
  tension: number;
  length: number;
}

export interface FloatationPhysics {
  buoyancy: number;
  dragCoefficient: number;
  maxLoad: number;
  currentLoad: number;
}