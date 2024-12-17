export interface PhysicsObject {
  position: [number, number, number];
  velocity: [number, number, number];
  mass: number;
  radius: number;
}

export interface GrabPoint {
  position: [number, number, number];
  isGrabbed: boolean;
  grabberPosition: [number, number, number] | null;
}

export interface RescuePhysicsState {
  isGrabbing: boolean;
  grabPoints: GrabPoint[];
  dragForce: number;
  buoyancyForce: number;
}