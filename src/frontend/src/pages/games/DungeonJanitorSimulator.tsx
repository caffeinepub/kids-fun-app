import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface DungeonJanitorSimulatorProps {
  onNavigate: (page: ModulePage) => void;
}

interface Debris {
  x: number;
  y: number;
  type: 'trap' | 'monster' | 'cursed';
  cleaned: boolean;
}

export default function DungeonJanitorSimulator({ onNavigate }: DungeonJanitorSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    playerX: 400,
    playerY: 300,
    debris: [] as Debris[],
    spawnTimer: 0,
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const debris: Debris[] = [];
    const types: ('trap' | 'monster' | 'cursed')[] = ['trap', 'monster', 'cursed'];
    for (let i = 0; i < 15; i++) {
      debris.push({
        x: 50 + Math.random() * 700,
        y: 50 + Math.random() * 500,
        type: types[Math.floor(Math.random() * types.length)],
        cleaned: false,
      });
    }

    gameStateRef.current = {
      playerX: 400,
      playerY: 300,
      debris,
      spawnTimer: 0,
      keys: {},
    };
    setScore(0);
    setGameOver(false);
  };

  const handleRestart = () => {
    initGame();
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;
    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      const state = gameStateRef.current;

      if (!gameOver) {
        // Player movement
        const speed = 4;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.playerX -= speed;
        if (state.keys['ArrowRight'] || state.keys['d']) state.playerX += speed;
        if (state.keys['ArrowUp'] || state.keys['w']) state.playerY -= speed;
        if (state.keys['ArrowDown'] || state.keys['s']) state.playerY += speed;

        // Boundaries
        state.playerX = Math.max(25, Math.min(canvas.width - 25, state.playerX));
        state.playerY = Math.max(25, Math.min(canvas.height - 25, state.playerY));

        // Clean debris
        state.debris.forEach(debris => {
          if (!debris.cleaned) {
            const dx = debris.x - state.playerX;
            const dy = debris.y - state.playerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 40) {
              debris.cleaned = true;
              const points = debris.type === 'cursed' ? 30 : debris.type === 'monster' ? 20 : 10;
              setScore(s => s + points);
            }
          }
        });

        // Spawn new debris
        state.spawnTimer += deltaTime;
        if (state.spawnTimer > 3000) {
          state.spawnTimer = 0;
          const types: ('trap' | 'monster' | 'cursed')[] = ['trap', 'monster', 'cursed'];
          state.debris.push({
            x: 50 + Math.random() * 700,
            y: 50 + Math.random() * 500,
            type: types[Math.floor(Math.random() * types.length)],
            cleaned: false,
          });
        }

        // Check win condition
        const uncleaned = state.debris.filter(d => !d.cleaned).length;
        if (score >= 500) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      // Render
      ctx.fillStyle = '#2C1810';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stone floor
      ctx.fillStyle = '#4A4A4A';
      for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.fillRect(x, y, 48, 48);
        }
      }

      // Draw debris
      state.debris.forEach(debris => {
        if (!debris.cleaned) {
          if (debris.type === 'trap') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(debris.x - 15, debris.y - 15, 30, 30);
            ctx.fillStyle = '#FFD700';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚠️', debris.x, debris.y + 7);
          } else if (debris.type === 'monster') {
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(debris.x, debris.y, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('💀', debris.x, debris.y + 7);
          } else {
            ctx.fillStyle = '#8B008B';
            ctx.beginPath();
            ctx.moveTo(debris.x, debris.y - 20);
            ctx.lineTo(debris.x - 15, debris.y + 10);
            ctx.lineTo(debris.x + 15, debris.y + 10);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('✨', debris.x, debris.y + 5);
          }
        }
      });

      // Draw player (janitor)
      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🧹', state.playerX, state.playerY + 10);

      // Draw UI
      const uncleaned = state.debris.filter(d => !d.cleaned).length;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Debris Left: ${uncleaned}`, 10, 30);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore]);

  return (
    <GameLayout
      title="Dungeon Janitor Simulator 🧹"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Arrow keys or WASD to move</p>
          <p className="text-sm">Clean up traps, monster remains, and cursed items!</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-gray-600 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
