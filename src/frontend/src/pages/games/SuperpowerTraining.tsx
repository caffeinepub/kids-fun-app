import { useState, useEffect, useCallback } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

type Power = 'strength' | 'speed' | 'flight' | 'shield';

interface Obstacle {
  id: number;
  x: number;
  y: number;
  type: 'wall' | 'enemy' | 'target';
}

interface SuperpowerTrainingProps {
  onNavigate: (page: ModulePage) => void;
}

export default function SuperpowerTraining({ onNavigate }: SuperpowerTrainingProps) {
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(20);
  const [playerY, setPlayerY] = useState(50);
  const [unlockedPowers, setUnlockedPowers] = useState<Power[]>(['strength']);
  const [activePower, setActivePower] = useState<Power>('strength');
  const [level, setLevel] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [nextId, setNextId] = useState(0);

  const powerEmojis: Record<Power, string> = {
    strength: '💪',
    speed: '⚡',
    flight: '🦅',
    shield: '🛡️',
  };

  const startGame = () => {
    setScore(0);
    setPlayerX(20);
    setPlayerY(50);
    setUnlockedPowers(['strength']);
    setActivePower('strength');
    setLevel(1);
    setObstacles([]);
    setGameOver(false);
    setNextId(0);
  };

  useEffect(() => {
    if (gameOver) return;

    // Spawn obstacles
    const spawnInterval = setInterval(() => {
      if (obstacles.length < 5) {
        const types: Array<'wall' | 'enemy' | 'target'> = ['wall', 'enemy', 'target'];
        setObstacles(prev => [...prev, {
          id: nextId,
          x: 100,
          y: Math.random() * 80 + 10,
          type: types[Math.floor(Math.random() * types.length)],
        }]);
        setNextId(id => id + 1);
      }
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameOver, obstacles, nextId]);

  useEffect(() => {
    if (gameOver) return;

    const moveInterval = setInterval(() => {
      setObstacles(prev => 
        prev
          .map(o => ({ ...o, x: o.x - 2 }))
          .filter(o => o.x > -10)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    // Unlock powers based on score
    if (score >= 100 && !unlockedPowers.includes('speed')) {
      setUnlockedPowers(prev => [...prev, 'speed']);
    }
    if (score >= 200 && !unlockedPowers.includes('flight')) {
      setUnlockedPowers(prev => [...prev, 'flight']);
    }
    if (score >= 300 && !unlockedPowers.includes('shield')) {
      setUnlockedPowers(prev => [...prev, 'shield']);
    }

    // Level up
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [score, unlockedPowers, level]);

  useEffect(() => {
    // Check collisions
    obstacles.forEach(obstacle => {
      const distance = Math.sqrt(
        Math.pow(playerX - obstacle.x, 2) + Math.pow(playerY - obstacle.y, 2)
      );
      
      if (distance < 8) {
        if (obstacle.type === 'target') {
          setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
          setScore(prev => prev + 20);
        } else if (obstacle.type === 'enemy') {
          if (activePower !== 'shield') {
            setGameOver(true);
          } else {
            setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
            setScore(prev => prev + 10);
          }
        } else if (obstacle.type === 'wall') {
          if (activePower !== 'flight') {
            setGameOver(true);
          }
        }
      }
    });
  }, [playerX, playerY, obstacles, activePower]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    const speed = activePower === 'speed' ? 5 : 3;
    
    if (e.key === 'ArrowUp') setPlayerY(prev => Math.max(5, prev - speed));
    else if (e.key === 'ArrowDown') setPlayerY(prev => Math.min(90, prev + speed));
    else if (e.key === 'ArrowLeft') setPlayerX(prev => Math.max(5, prev - speed));
    else if (e.key === 'ArrowRight') setPlayerX(prev => Math.min(90, prev + speed));
    else if (e.key === '1' && unlockedPowers.includes('strength')) setActivePower('strength');
    else if (e.key === '2' && unlockedPowers.includes('speed')) setActivePower('speed');
    else if (e.key === '3' && unlockedPowers.includes('flight')) setActivePower('flight');
    else if (e.key === '4' && unlockedPowers.includes('shield')) setActivePower('shield');
  }, [gameOver, activePower, unlockedPowers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <GameLayout
      title="🦸 Superpower Training"
      score={score}
      highScore={highScore}
      onRestart={startGame}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="relative w-full h-[600px] bg-gradient-to-br from-orange-200 via-red-200 to-purple-200 overflow-hidden">
        {/* Level indicator */}
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg border-3 border-orange-400 z-20">
          <span className="font-bold">Level: {level}</span>
        </div>

        {/* Instructions */}
        {obstacles.length === 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-lg border-4 border-purple-300 z-20 text-center max-w-md">
            <p className="font-bold mb-2">Train your superpowers!</p>
            <p className="text-sm">Hit targets 🎯, avoid enemies 👾, use powers wisely!</p>
          </div>
        )}

        {/* Power selector */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg border-4 border-purple-300 z-20">
          <div className="text-sm font-bold mb-2">Powers (1-4):</div>
          <div className="flex gap-2">
            {(['strength', 'speed', 'flight', 'shield'] as Power[]).map((power, idx) => (
              <button
                key={power}
                onClick={() => unlockedPowers.includes(power) && setActivePower(power)}
                disabled={!unlockedPowers.includes(power)}
                className={`px-3 py-2 rounded border-2 transition-all ${
                  activePower === power 
                    ? 'border-purple-600 bg-purple-100 scale-110' 
                    : 'border-gray-300'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
                title={power}
              >
                <div className="text-2xl">{powerEmojis[power]}</div>
                {!unlockedPowers.includes(power) && (
                  <div className="text-xs">🔒</div>
                )}
              </button>
            ))}
          </div>
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
          <div className="text-5xl">🦸</div>
          <div className="text-2xl absolute -top-2 -right-2">{powerEmojis[activePower]}</div>
        </div>

        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute transition-all duration-100"
            style={{
              left: `${obstacle.x}%`,
              top: `${obstacle.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="text-5xl">
              {obstacle.type === 'wall' && '🧱'}
              {obstacle.type === 'enemy' && '👾'}
              {obstacle.type === 'target' && '🎯'}
            </div>
          </div>
        ))}

        {/* Unlock notifications */}
        {score >= 100 && score < 120 && !unlockedPowers.includes('speed') && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 px-8 py-4 rounded-lg border-4 border-yellow-600 z-30 animate-bounce">
            <div className="text-2xl font-bold">⚡ Speed Unlocked!</div>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
