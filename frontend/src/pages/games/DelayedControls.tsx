import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface DelayedControlsProps {
  onNavigate: (page: ModulePage) => void;
}

export default function DelayedControls({ onNavigate }: DelayedControlsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 100, y: 500 },
    inputQueue: [] as { key: string; time: number }[],
    obstacles: [] as { x: number; y: number; width: number; height: number }[],
    coins: [] as { x: number; y: number; collected: boolean }[],
    goal: { x: 700, y: 100 },
    delay: 500, // 500ms delay
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 100, y: 500 };
    state.goal = { x: 700, y: 100 };
    state.inputQueue = [];
    state.obstacles = [];
    state.coins = [];
    
    // Create obstacles
    for (let i = 0; i < 8; i++) {
      state.obstacles.push({
        x: 150 + i * 80,
        y: 200 + Math.random() * 300,
        width: 50,
        height: 50,
      });
    }
    
    // Create coins
    for (let i = 0; i < 10; i++) {
      state.coins.push({
        x: 150 + i * 60,
        y: 150 + Math.random() * 350,
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
      const state = gameStateRef.current;
      
      // Add input to queue with timestamp
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'].includes(e.key)) {
        state.inputQueue.push({
          key: e.key,
          time: Date.now() + state.delay,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    let animationId: number;

    const gameLoop = () => {
      const state = gameStateRef.current;
      const now = Date.now();

      if (!gameOver) {
        // Process delayed inputs
        state.inputQueue = state.inputQueue.filter(input => {
          if (input.time <= now) {
            // Execute the input
            const speed = 5;
            const oldX = state.player.x;
            const oldY = state.player.y;
            
            if (input.key === 'ArrowLeft' || input.key === 'a') state.player.x -= speed;
            if (input.key === 'ArrowRight' || input.key === 'd') state.player.x += speed;
            if (input.key === 'ArrowUp' || input.key === 'w') state.player.y -= speed;
            if (input.key === 'ArrowDown' || input.key === 's') state.player.y += speed;

            state.player.x = Math.max(20, Math.min(780, state.player.x));
            state.player.y = Math.max(20, Math.min(580, state.player.y));

            // Check collision with obstacles
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
              setScore(s => Math.max(0, s - 5));
            }

            return false; // Remove from queue
          }
          return true; // Keep in queue
        });

        // Collect coins
        state.coins.forEach(coin => {
          if (!coin.collected) {
            const dx = coin.x - state.player.x;
            const dy = coin.y - state.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              coin.collected = true;
              setScore(s => s + 10);
            }
          }
        });

        // Check goal
        const dx = state.goal.x - state.player.x;
        const dy = state.goal.y - state.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 40) {
          setScore(s => s + 100);
          setGameOver(true);
          if (score + 100 > highScore) setHighScore(score + 100);
        }
      }

      // Render
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Goal
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(state.goal.x, state.goal.y, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏁', state.goal.x, state.goal.y + 10);

      // Obstacles
      state.obstacles.forEach(obs => {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#fff';
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
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Show queued inputs
      state.inputQueue.slice(0, 5).forEach((input, idx) => {
        const timeLeft = input.time - now;
        const alpha = Math.max(0, Math.min(1, timeLeft / state.delay));
        
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.beginPath();
        ctx.arc(state.player.x + (idx - 2) * 25, state.player.y - 40, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 320, 120);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('⏱️ Delayed Controls!', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText(`Input delay: ${state.delay}ms`, 20, 60);
      ctx.fillText(`Queued inputs: ${state.inputQueue.length}`, 20, 80);
      ctx.fillText('Plan ahead! Controls are delayed', 20, 100);
      ctx.fillText('Avoid red obstacles', 20, 120);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, score, highScore]);

  return (
    <GameLayout
      title="Delayed Controls ⏱️"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Your controls are delayed by 0.5 seconds!</p>
          <p className="text-sm">Arrow keys/WASD to move • Plan ahead • Reach the goal</p>
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
