const DRAG_COEFFICIENT = 0.47; // Sphere approximation
const GRAVITY = 9.81;

export function calculateDragForce(
  velocity: [number, number, number],
  waterDensity: number
): number {
  const speed = Math.sqrt(
    velocity[0] * velocity[0] +
    velocity[1] * velocity[1] +
    velocity[2] * velocity[2]
  );
  
  return 0.5 * waterDensity * DRAG_COEFFICIENT * Math.PI * speed * speed;
}

export function calculateBuoyancy(
  mass: number,
  waterDensity: number
): number {
  const volume = mass / waterDensity; // Approximated volume
  const buoyancyForce = waterDensity * volume * GRAVITY;
  return buoyancyForce;
}

export function calculateGrabForce(
  grabberPosition: [number, number, number],
  victimPosition: [number, number, number],
  springConstant: number = 100
): [number, number, number] {
  const dx = grabberPosition[0] - victimPosition[0];
  const dy = grabberPosition[1] - victimPosition[1];
  const dz = grabberPosition[2] - victimPosition[2];
  
  return [
    dx * springConstant,
    dy * springConstant,
    dz * springConstant,
  ];
}