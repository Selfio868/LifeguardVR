import React from 'react';
import { RescueEquipment } from '../equipment/RescueEquipment';
import { RopeRenderer } from '../equipment/RopeRenderer';

export function RescueTools() {
  const handleSelect = (id: string) => {
    window.dispatchEvent(new CustomEvent('objectselect', {
      detail: { objectId: id }
    }));
  };

  return (
    <group>
      <RescueEquipment 
        type="rescueTube"
        initialPosition={[1.5, 1, -2]}
        onSelect={() => handleSelect('rescueTube')}
      />
      
      <RescueEquipment 
        type="throwRope"
        initialPosition={[-1.5, 1, -2]}
        onSelect={() => handleSelect('throwRope')}
      />
      
      <RescueEquipment 
        type="lifeRing"
        initialPosition={[0, 1, -2.5]}
        onSelect={() => handleSelect('lifeRing')}
      />
    </group>
  );
}