import { useCallback, useRef, useEffect, useState } from 'react';
import { AlertTriangle, Heart, Timer, Rewind, FastForward, Play, Pause } from 'lucide-react';
import { useVictimStore } from '../../store/victimStore';
import { DROWNING_CHARACTERISTICS } from '../../types/victim';

export function DrowningStagesHUD() {
  const { behavior, setElapsedTime } = useVictimStore();
  const lastUpdateRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();
  const [timeScale, setTimeScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const updateTimer = useCallback(() => {
    if (isPaused) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
      return;
    }

    const now = Date.now();
    const deltaTime = (now - lastUpdateRef.current) / 1000;
    lastUpdateRef.current = now;
    
    setElapsedTime((prev) => prev + deltaTime * timeScale);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [setElapsedTime, timeScale, isPaused]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateTimer);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateColor = () => {
    switch (behavior.state) {
      case 'active_swimming':
        return 'bg-green-500';
      case 'distressed':
        return 'bg-yellow-500';
      case 'drowning_active':
        return 'bg-orange-500';
      case 'drowning_passive':
        return 'bg-red-500';
      case 'submerged':
      case 'unconscious':
        return 'bg-red-700';
      default:
        return 'bg-gray-500';
    }
  };

  const handleRewind = () => {
    setElapsedTime(Math.max(0, behavior.timeUnderwater - 30));
  };

  const handleFastForward = () => {
    setElapsedTime(behavior.timeUnderwater + 30);
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
      <div className={`${getStateColor()} text-white p-4 rounded-lg shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span className="font-mono">{formatTime(behavior.timeUnderwater)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{Math.round(behavior.oxygenLevel)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">
            {behavior.state.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
        </div>

        <div className="text-sm bg-black/20 p-2 rounded">
          <p>{DROWNING_CHARACTERISTICS[behavior.state].description}</p>
        </div>

        {(behavior.state === 'drowning_active' || behavior.state === 'drowning_passive') && (
          <div className="mt-2 bg-red-600/80 p-2 rounded animate-pulse">
            <span className="font-bold">CRITICAL: Immediate rescue required!</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-4 bg-black/20 p-2 rounded">
          <button 
            onClick={handleRewind}
            className="hover:bg-black/20 p-2 rounded transition-colors"
            title="Rewind 30 seconds"
          >
            <Rewind className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlayPause}
            className="hover:bg-black/20 p-2 rounded transition-colors"
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleFastForward}
            className="hover:bg-black/20 p-2 rounded transition-colors"
            title="Fast forward 30 seconds"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}