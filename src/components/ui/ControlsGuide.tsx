import { Info } from 'lucide-react';

export function ControlsGuide() {
  return (
    <div className="fixed bottom-4 left-4 bg-black/50 text-white p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4" />
        <span className="font-semibold">Controls Guide</span>
      </div>
      <ul className="text-sm space-y-1">
        <li>WASD - Move camera</li>
        <li>Q/E - Move up/down</li>
        <li>R - Reset camera position</li>
        <li>Mouse drag - Look around</li>
        <li>Mouse wheel - Zoom in/out</li>
      </ul>
    </div>
  );
}