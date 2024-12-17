import { useState, useEffect } from 'react';
import { useVictimStore } from '../../store/victimStore';
import { DROWNING_CHARACTERISTICS } from '../../types/victim';

export function InteractionTooltips() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const { behavior } = useVictimStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleObjectHover = (e: CustomEvent) => {
      setHoveredObject(e.detail?.objectId || null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('objecthover', handleObjectHover as EventListener);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('objecthover', handleObjectHover as EventListener);
    };
  }, []);

  if (!hoveredObject) return null;

  const getTooltipContent = () => {
    if (hoveredObject === 'victim') {
      const characteristics = DROWNING_CHARACTERISTICS[behavior.state];
      return (
        <div className="space-y-1">
          <p className="font-semibold">Victim Status: {behavior.state.replace('_', ' ')}</p>
          <ul className="text-sm">
            <li>Head Position: {characteristics.headPosition}</li>
            <li>Arm Movement: {characteristics.armMovement}</li>
            <li>Leg Movement: {characteristics.legMovement}</li>
            <li>Body Position: {characteristics.bodyPosition}</li>
          </ul>
          <p className="text-xs italic mt-1">Click to interact with victim</p>
        </div>
      );
    }
    return null;
  };

  const tooltipContent = getTooltipContent();
  if (!tooltipContent) return null;

  return (
    <div
      className="fixed pointer-events-none bg-black/75 text-white p-3 rounded-lg shadow-lg z-50"
      style={{
        left: mousePosition.x + 15,
        top: mousePosition.y + 15,
        maxWidth: '300px'
      }}
    >
      {tooltipContent}
    </div>
  );
}