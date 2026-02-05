import { useState, useEffect, useCallback } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

type Role = 'engineer' | 'explorer' | 'trader';
type Event = 'meteor' | 'alien' | 'treasure' | 'malfunction';

interface Resource {
  energy: number;
  materials: number;
  credits: number;
}

interface SpaceStationLifeProps {
  onNavigate: (page: ModulePage) => void;
}

export default function SpaceStationLife({ onNavigate }: SpaceStationLifeProps) {
  const [score, setScore] = useState(0);
  const [role, setRole] = useState<Role>('engineer');
  const [resources, setResources] = useState<Resource>({ energy: 100, materials: 50, credits: 100 });
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [day, setDay] = useState(1);
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);

  const roleEmojis: Record<Role, string> = {
    engineer: '🔧',
    explorer: '🚀',
    trader: '💼',
  };

  const startGame = () => {
    setScore(0);
    setRole('engineer');
    setResources({ energy: 100, materials: 50, credits: 100 });
    setCurrentEvent(null);
    setGameOver(false);
    setDay(1);
    setPlayerX(50);
    setPlayerY(50);
  };

  useEffect(() => {
    if (gameOver) return;

    const dayInterval = setInterval(() => {
      setDay(prev => prev + 1);
      
      // Consume resources
      setResources(prev => ({
        energy: Math.max(0, prev.energy - 5),
        materials: prev.materials,
        credits: prev.credits,
      }));

      // Random events
      if (Math.random() < 0.3) {
        const events: Event[] = ['meteor', 'alien', 'treasure', 'malfunction'];
        setCurrentEvent(events[Math.floor(Math.random() * events.length)]);
      }

      // Generate income based on role
      if (role === 'trader') {
        setResources(prev => ({ ...prev, credits: prev.credits + 20 }));
        setScore(prev => prev + 10);
      } else if (role === 'engineer') {
        setResources(prev => ({ ...prev, materials: prev.materials + 10 }));
        setScore(prev => prev + 5);
      } else {
        setScore(prev => prev + 15);
      }
    }, 5000);

    return () => clearInterval(dayInterval);
  }, [gameOver, role]);

  useEffect(() => {
    if (resources.energy <= 0) {
      setGameOver(true);
    }
  }, [resources.energy]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  const handleEvent = (action: 'accept' | 'decline') => {
    if (!currentEvent) return;

    if (action === 'accept') {
      if (currentEvent === 'meteor') {
        if (role === 'engineer') {
          setResources(prev => ({ ...prev, materials: prev.materials + 30 }));
          setScore(prev => prev + 50);
        } else {
          setResources(prev => ({ ...prev, energy: Math.max(0, prev.energy - 20) }));
        }
      } else if (currentEvent === 'alien') {
        if (role === 'explorer') {
          setScore(prev => prev + 100);
        } else {
          setResources(prev => ({ ...prev, credits: Math.max(0, prev.credits - 30) }));
        }
      } else if (currentEvent === 'treasure') {
        setResources(prev => ({ ...prev, credits: prev.credits + 50 }));
        setScore(prev => prev + 75);
      } else if (currentEvent === 'malfunction') {
        if (role === 'engineer') {
          setResources(prev => ({ ...prev, energy: Math.min(100, prev.energy + 20) }));
          setScore(prev => prev + 40);
        } else {
          setResources(prev => ({ ...prev, materials: Math.max(0, prev.materials - 20) }));
        }
      }
    }
    
    setCurrentEvent(null);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver || currentEvent) return;
    
    const speed = 3;
    if (e.key === 'ArrowUp') setPlayerY(prev => Math.max(10, prev - speed));
    else if (e.key === 'ArrowDown') setPlayerY(prev => Math.min(85, prev + speed));
    else if (e.key === 'ArrowLeft') setPlayerX(prev => Math.max(10, prev - speed));
    else if (e.key === 'ArrowRight') setPlayerX(prev => Math.min(85, prev + speed));
  }, [gameOver, currentEvent]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <GameLayout
      title="🛸 Space Station Life"
      score={score}
      highScore={highScore}
      onRestart={startGame}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="relative w-full h-[600px] bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
        {/* Stars background */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Stats panel */}
        <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg border-3 border-cyan-400 z-20 space-y-2">
          <div className="font-bold">Day: {day}</div>
          <div className="font-bold">⚡ Energy: {resources.energy}</div>
          <div className="font-bold">🔩 Materials: {resources.materials}</div>
          <div className="font-bold">💰 Credits: {resources.credits}</div>
        </div>

        {/* Role selector */}
        <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg border-3 border-cyan-400 z-20">
          <div className="text-sm font-bold mb-2">Your Role:</div>
          <div className="flex gap-2">
            {(['engineer', 'explorer', 'trader'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-2 rounded border-2 transition-all ${
                  role === r ? 'border-cyan-400 bg-cyan-900' : 'border-gray-600'
                }`}
              >
                <div className="text-2xl">{roleEmojis[r]}</div>
                <div className="text-xs capitalize">{r}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Space station */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-9xl opacity-50">🛰️</div>
        </div>

        {/* Player */}
        <div
          className="absolute transition-all duration-100 z-10"
          style={{
            left: `${playerX}%`,
            top: `${playerY}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="text-5xl">{roleEmojis[role]}</div>
        </div>

        {/* Event overlay */}
        {currentEvent && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8 rounded-lg border-4 border-cyan-400 max-w-md w-full mx-4">
              <div className="text-center space-y-4">
                <div className="text-6xl">
                  {currentEvent === 'meteor' && '☄️'}
                  {currentEvent === 'alien' && '👽'}
                  {currentEvent === 'treasure' && '💎'}
                  {currentEvent === 'malfunction' && '⚠️'}
                </div>
                <div className="text-2xl font-bold capitalize">{currentEvent}!</div>
                <div className="text-lg">
                  {currentEvent === 'meteor' && 'A meteor shower approaches!'}
                  {currentEvent === 'alien' && 'Alien contact detected!'}
                  {currentEvent === 'treasure' && 'Treasure found nearby!'}
                  {currentEvent === 'malfunction' && 'System malfunction!'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEvent('accept')}
                    className="flex-1 px-6 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition-colors"
                  >
                    Handle It
                  </button>
                  <button
                    onClick={() => handleEvent('decline')}
                    className="flex-1 px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition-colors"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {day === 1 && !currentEvent && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg border-3 border-cyan-400 z-20 text-center">
            <p className="font-bold">Arrow keys to move • Choose your role wisely!</p>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
