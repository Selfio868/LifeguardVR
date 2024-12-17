import { useState, useEffect } from 'react';
import { Clock, Heart, AlertTriangle } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export function TrainingHUD() {
  const [time, setTime] = useState(0);
  const [vitals, setVitals] = useState(100);
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full p-4 pointer-events-none">
      <div className="flex justify-between items-start max-w-4xl mx-auto">
        <div className="bg-black/50 text-white p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Heart className="w-4 h-4" />
            <div className="w-32 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${vitals}%` }}
              />
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="bg-black/50 text-white p-3 rounded-lg">
            <p className="text-sm">Trainee: {currentUser.name}</p>
            <p className="text-sm">Level: {currentUser.level}</p>
          </div>
        )}

        <div className="bg-red-500/50 text-white p-3 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Victim in distress - Act now!</span>
          </div>
        </div>
      </div>
    </div>
  );
}