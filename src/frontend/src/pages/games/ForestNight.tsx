import { useState, useEffect, useCallback } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface ForestNightProps {
  onNavigate: (page: ModulePage) => void;
}

export default function ForestNight({ onNavigate }: ForestNightProps) {
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [nextId, setNextId] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [visibility, setVisibility] = useState(20);

  const startGame = () => {
    setScore(0);
    setPlayerX(50);
    setPlayerY(50);
    setCoins([]);
    setGameOver(false);
    setTimeLeft(90);
    setNextId(0);
    setVisibility(20);
  };

  useEffect(() => {
    if (gameOver || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, timeLeft]);

  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(() => {
      if (coins.filter(c => !c.collected).length < 5) {
        setCoins(prev => [...prev, {
          id: nextId,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          collected: false,
        }]);
        setNextId(id => id + 1);
      }
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameOver, coins, nextId]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    const speed = 2;
    if (e.key === 'ArrowUp') {
      setPlayerY(prev => Math.max(5, prev - speed));
    } else if (e.key === 'ArrowDown') {
      setPlayerY(prev => Math.min(90, prev + speed));
    } else if (e.key === 'ArrowLeft') {
      setPlayerX(prev => Math.max(5, prev - speed));
    } else if (e.key === 'ArrowRight') {
      setPlayerX(prev => Math.min(90, prev + speed));
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    // Check for coin collection
    coins.forEach(coin => {
      if (!coin.collected) {
        const distance = Math.sqrt(
          Math.pow(playerX - coin.x, 2) + Math.pow(playerY - coin.y, 2)
        );
        if (distance < 8) {
          setCoins(prev => prev.map(c => 
            c.id === coin.id ? { ...c, collected: true } : c
          ));
          setScore(prev => prev + 10);
          setVisibility(prev => Math.min(prev + 2, 40));
        }
      }
    });
  }, [playerX, playerY, coins]);

  return (
    <GameLayout
      title="🌲 Forest Night"
      score={score}
      highScore={highScore}
      onRestart={startGame}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="relative w-full h-[600px] bg-gradient-to-br from-green-900 to-black overflow-hidden">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Visibility circle around player */}
        <div
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            left: `${playerX}%`,
            top: `${playerY}%`,
            width: `${visibility}%`,
            height: `${visibility}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Time Display */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full border-4 border-green-300 z-20">
          <span className="text-2xl font-bold">⏰ {timeLeft}s</span>
        </div>

        {/* Instructions */}
        {coins.length === 0 && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-white p-8 rounded-lg border-4 border-green-400 text-center">
              <h2 className="text-3xl font-bold mb-4">Find Your Way!</h2>
              <p className="text-lg mb-2">Use arrow keys to move</p>
              <p className="text-lg">Collect coins 🪙 to increase visibility!</p>
            </div>
          </div>
        )}

        {/* Player */}
        <div
          className="absolute transition-all duration-100 z-20"
          style={{
            left: `${playerX}%`,
            top: `${playerY}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="text-5xl">🧑</div>
        </div>

        {/* Coins */}
        {coins.map(coin => {
          if (coin.collected) return null;
          
          const distance = Math.sqrt(
            Math.pow(playerX - coin.x, 2) + Math.pow(playerY - coin.y, 2)
          );
          const isVisible = distance < visibility / 2;
          
          return (
            <div
              key={coin.id}
              className={`absolute transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{
                left: `${coin.x}%`,
                top: `${coin.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="text-4xl animate-bounce">🪙</div>
            </div>
          );
        })}

        {/* Visibility indicator */}
        <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg border-3 border-yellow-400 z-20">
          <span className="font-bold">Visibility: {Math.floor(visibility)}%</span>
        </div>
      </div>
    </GameLayout>
  );
}
