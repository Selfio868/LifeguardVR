import React from 'react';
import { VRScene } from './components/VRScene';
import { DrowningStagesHUD } from './components/ui/DrowningStagesHUD';
import { ControlsGuide } from './components/ui/ControlsGuide';
import { InteractionTooltips } from './components/ui/InteractionTooltips';

function App() {
  return (
    <div className="w-full h-screen relative">
      <VRScene />
      <DrowningStagesHUD />
      <ControlsGuide />
      <InteractionTooltips />
    </div>
  );
}

export default App;