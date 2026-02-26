import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface TimeLoopPizzaDeliveryProps {
  onNavigate: (page: ModulePage) => void;
}

interface Pizza {
  x: number;
  y: number;
  delivered: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  type: 'car' | 'cone' | 'puddle';
  removed: boolean;
}

export default function TimeLoopPizzaDelivery({ onNavigate }: TimeLoopPizzaDeliveryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const gameStateRef = useRef({
    playerX: 100,
    playerY: 300,
    pizzas: [] as Pizza[],
    obstacles: [] as Obstacle[],
    timeLeft: 60,
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const pizzas: Pizza[] = [];
    for (let i = 0; i < 5; i++) {
      pizzas.push({
        x: 150 + i * 120,
        y: 100 + Math.random() * 400,
        delivered: false,
      });
    }

    const obstacles: Obstacle[] = [];
    const types: ('car' | 'cone' | 'puddle')[] = ['car', 'cone', 'puddle'];
    for (let i = 0; i < 8; i++) {
      obstacles.push({
        x: 200 + Math.random() * 500,
        y: 100 + Math.random() * 400,
        type: types[Math.floor(Math.random() * types.length)],
        removed: false,
      });
    }

    gameStateRef.current = {
      playerX: 100,
      playerY: 300,
      pizzas,
      obstacles,
      timeLeft: 60,
      keys: {},
    };
    setGameOver(false);
  };

  const handleRestart = () => {
    setScore(0);
    setLoopCount(0);
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
      if (e.key === ' ' && !gameOver) {
        const state = gameStateRef.current;
        // Remove nearby obstacle
        state.obstacles.forEach(obs => {
          const dx = obs.x - state.playerX;
          const dy = obs.y - state.playerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50 && !obs.removed) {
            obs.removed = true;
            setScore(s => s + 10);
          }
        });
      }
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
        // Update time
        state.timeLeft -= deltaTime / 1000;
        if (state.timeLeft <= 0) {
          // Time loop reset
          setLoopCount(l => l + 1);
          state.timeLeft = 60;
          state.playerX = 100;
          state.playerY = 300;
          // Keep removed obstacles removed
          state.pizzas.forEach(p => p.delivered = false);
        }

        // Player movement
        const speed = 3;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.playerX -= speed;
        if (state.keys['ArrowRight'] || state.keys['d']) state.playerX += speed;
        if (state.keys['ArrowUp'] || state.keys['w']) state.playerY -= speed;
        if (state.keys['ArrowDown'] || state.keys['s']) state.playerY += speed;

        // Boundaries
        state.playerX = Math.max(20, Math.min(canvas.width - 20, state.playerX));
        state.playerY = Math.max(20, Math.min(canvas.height - 20, state.playerY));

        // Check pizza delivery
        state.pizzas.forEach(pizza => {
          if (!pizza.delivered) {
            const dx = pizza.x - state.playerX;
            const dy = pizza.y - state.playerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              pizza.delivered = true;
              setScore(s => s + 50);
            }
          }
        });

        // Check if all pizzas delivered
        if (state.pizzas.every(p => p.delivered)) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      // Render
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw obstacles
      state.obstacles.forEach(obs => {
        if (!obs.removed) {
          if (obs.type === 'car') {
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(obs.x - 20, obs.y - 15, 40, 30);
          } else if (obs.type === 'cone') {
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y - 20);
            ctx.lineTo(obs.x - 15, obs.y + 10);
            ctx.lineTo(obs.x + 15, obs.y + 10);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillStyle = '#4169E1';
            ctx.beginPath();
            ctx.arc(obs.x, obs.y, 20, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw pizzas
      state.pizzas.forEach(pizza => {
        if (!pizza.delivered) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(pizza.x, pizza.y, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FF6347';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🍕', pizza.x, pizza.y + 7);
        }
      });

      // Draw player
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🚴', state.playerX, state.playerY + 8);

      // Draw UI
      ctx.fillStyle = '#000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Time: ${Math.ceil(state.timeLeft)}s`, 10, 30);
      ctx.fillText(`Loop: ${loopCount}`, 10, 60);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore, loopCount]);

  return (
    <GameLayout
      title="Time-Loop Pizza Delivery 🍕"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="mb-4 text-center">
          <p className="text-lg font-semibold">Arrow keys or WASD to move • Space to remove obstacles</p>
          <p className="text-sm text-gray-600">Deliver all pizzas before the 60-second loop resets!</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-purple-400 rounded-lg shadow-lg bg-white"
        />
      </div>
    </GameLayout>
  );
}
