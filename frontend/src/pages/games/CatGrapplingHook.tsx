import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface CatGrapplingHookProps {
  onNavigate: (page: ModulePage) => void;
}

interface Food {
  x: number;
  y: number;
  collected: boolean;
}

interface Enemy {
  x: number;
  y: number;
  vx: number;
}

export default function CatGrapplingHook({ onNavigate }: CatGrapplingHookProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    catX: 100,
    catY: 500,
    catVX: 0,
    catVY: 0,
    grappleX: 0,
    grappleY: 0,
    grappling: false,
    foods: [] as Food[],
    enemies: [] as Enemy[],
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const foods: Food[] = [];
    for (let i = 0; i < 10; i++) {
      foods.push({
        x: 100 + Math.random() * 600,
        y: 50 + Math.random() * 400,
        collected: false,
      });
    }

    const enemies: Enemy[] = [];
    for (let i = 0; i < 5; i++) {
      enemies.push({
        x: 200 + i * 150,
        y: 500,
        vx: 2 + Math.random() * 2,
      });
    }

    gameStateRef.current = {
      catX: 100,
      catY: 500,
      catVX: 0,
      catVY: 0,
      grappleX: 0,
      grappleY: 0,
      grappling: false,
      foods,
      enemies,
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

    const handleClick = (e: MouseEvent) => {
      if (gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const state = gameStateRef.current;
      if (!state.grappling) {
        state.grappling = true;
        state.grappleX = x;
        state.grappleY = y;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    let animationId: number;

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (!gameOver) {
        // Grappling physics
        if (state.grappling) {
          const dx = state.grappleX - state.catX;
          const dy = state.grappleY - state.catY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 10) {
            state.catVX += (dx / dist) * 0.5;
            state.catVY += (dy / dist) * 0.5;
          } else {
            state.grappling = false;
          }
        }

        // Gravity
        state.catVY += 0.3;

        // Apply velocity
        state.catX += state.catVX;
        state.catY += state.catVY;

        // Friction
        state.catVX *= 0.95;
        state.catVY *= 0.98;

        // Ground collision
        if (state.catY > 500) {
          state.catY = 500;
          state.catVY = 0;
          state.grappling = false;
        }

        // Boundaries
        if (state.catX < 20) {
          state.catX = 20;
          state.catVX = 0;
        }
        if (state.catX > canvas.width - 20) {
          state.catX = canvas.width - 20;
          state.catVX = 0;
        }

        // Collect food
        state.foods.forEach(food => {
          if (!food.collected) {
            const dx = food.x - state.catX;
            const dy = food.y - state.catY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              food.collected = true;
              setScore(s => s + 10);
            }
          }
        });

        // Move enemies
        state.enemies.forEach(enemy => {
          enemy.x += enemy.vx;
          if (enemy.x < 50 || enemy.x > canvas.width - 50) {
            enemy.vx *= -1;
          }

          // Check collision
          const dx = enemy.x - state.catX;
          const dy = enemy.y - state.catY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
            setGameOver(true);
            if (score > highScore) setHighScore(score);
          }
        });

        // Win condition
        if (state.foods.every(f => f.collected)) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      // Render
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw platforms
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 520, canvas.width, 80);

      // Draw grapple line
      if (state.grappling) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(state.catX, state.catY);
        ctx.lineTo(state.grappleX, state.grappleY);
        ctx.stroke();
      }

      // Draw food
      state.foods.forEach(food => {
        if (!food.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(food.x, food.y, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FF6347';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🐟', food.x, food.y + 7);
        }
      });

      // Draw enemies
      state.enemies.forEach(enemy => {
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🐕', enemy.x, enemy.y + 8);
      });

      // Draw cat
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(state.catX, state.catY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐱', state.catX, state.catY + 10);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameOver, score, highScore]);

  return (
    <GameLayout
      title="Cat With a Grappling Hook 🐱"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-yellow-100">
        <div className="mb-4 text-center">
          <p className="text-lg font-semibold">Click to grapple and swing!</p>
          <p className="text-sm text-gray-600">Collect all fish while avoiding dogs!</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-orange-400 rounded-lg shadow-lg bg-white cursor-crosshair"
        />
      </div>
    </GameLayout>
  );
}
