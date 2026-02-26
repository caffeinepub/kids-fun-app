import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface SpeedIsHealthProps {
  onNavigate: (page: ModulePage) => void;
}

export default function SpeedIsHealth({ onNavigate }: SpeedIsHealthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 400, y: 300, vx: 0, vy: 0, health: 100 },
    obstacles: [] as { x: number; y: number; width: number; height: number }[],
    coins: [] as { x: number; y: number; collected: boolean }[],
    keys: {} as Record<string, boolean>,
    lastMoveTime: Date.now(),
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 400, y: 300, vx: 0, vy: 0, health: 100 };
    state.obstacles = [];
    state.coins = [];
    state.lastMoveTime = Date.now();
    
    // Create obstacles
    for (let i = 0; i < 10; i++) {
      state.obstacles.push({
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 400,
        width: 50 + Math.random() * 50,
        height: 50 + Math.random() * 50,
      });
    }
    
    // Create coins
    for (let i = 0; i < 15; i++) {
      state.coins.push({
        x: 50 + Math.random() * 700,
        y: 50 + Math.random() * 500,
        collected: false,
      });
    }
    
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

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (!gameOver) {
        const oldX = state.player.x;
        const oldY = state.player.y;

        // Player movement
        const speed = 6;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.player.vx = -speed;
        else if (state.keys['ArrowRight'] || state.keys['d']) state.player.vx = speed;
        else state.player.vx *= 0.9;

        if (state.keys['ArrowUp'] || state.keys['w']) state.player.vy = -speed;
        else if (state.keys['ArrowDown'] || state.keys['s']) state.player.vy = speed;
        else state.player.vy *= 0.9;

        state.player.x += state.player.vx;
        state.player.y += state.player.vy;

        state.player.x = Math.max(20, Math.min(780, state.player.x));
        state.player.y = Math.max(20, Math.min(580, state.player.y));

        // Calculate speed (distance moved)
        const dx = state.player.x - oldX;
        const dy = state.player.y - oldY;
        const currentSpeed = Math.sqrt(dx * dx + dy * dy);

        // Health based on speed
        if (currentSpeed < 2) {
          state.player.health -= 0.5; // Lose health when moving slowly
        } else {
          state.player.health = Math.min(100, state.player.health + 0.3); // Gain health when moving fast
        }

        // Collision with obstacles
        let collision = false;
        state.obstacles.forEach(obs => {
          if (
            state.player.x + 18 > obs.x &&
            state.player.x - 18 < obs.x + obs.width &&
            state.player.y + 18 > obs.y &&
            state.player.y - 18 < obs.y + obs.height
          ) {
            collision = true;
          }
        });

        if (collision) {
          state.player.x = oldX;
          state.player.y = oldY;
          state.player.vx = 0;
          state.player.vy = 0;
        }

        // Collect coins
        state.coins.forEach(coin => {
          if (!coin.collected) {
            const dx = coin.x - state.player.x;
            const dy = coin.y - state.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              coin.collected = true;
              setScore(s => s + 10);
              state.player.health = Math.min(100, state.player.health + 10);
            }
          }
        });

        // Check health
        if (state.player.health <= 0) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }

        // Bonus score for staying alive
        setScore(s => s + 0.1);
      }

      // Render
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Obstacles
      state.obstacles.forEach(obs => {
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      });

      // Coins
      state.coins.forEach(coin => {
        if (!coin.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('⭐', coin.x, coin.y + 7);
        }
      });

      // Player
      const healthColor = state.player.health > 50 ? '#22c55e' : state.player.health > 25 ? '#fbbf24' : '#ef4444';
      ctx.fillStyle = healthColor;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Speed trail
      const speed = Math.sqrt(state.player.vx * state.player.vx + state.player.vy * state.player.vy);
      if (speed > 2) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(state.player.x - state.player.vx * 2, state.player.y - state.player.vy * 2, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 300, 120);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ Keep Moving to Stay Alive!', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText(`Health: ${Math.floor(state.player.health)}`, 20, 60);
      ctx.fillText('Slow = Damage, Fast = Heal', 20, 80);
      ctx.fillText('Collect stars for bonus health', 20, 100);

      // Health bar
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(20, 105, 280, 15);
      ctx.fillStyle = healthColor;
      ctx.fillRect(20, 105, (state.player.health / 100) * 280, 15);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 105, 280, 15);

      // Speed indicator
      const currentSpeed = Math.sqrt(state.player.vx * state.player.vx + state.player.vy * state.player.vy);
      ctx.fillStyle = currentSpeed > 2 ? '#22c55e' : '#ef4444';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Speed: ${currentSpeed.toFixed(1)}`, 400, 30);

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
      title="Speed Is Health ⚡"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Keep moving fast to survive!</p>
          <p className="text-sm">Arrow keys/WASD to move • Stay fast to heal • Collect stars</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-purple-500 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
