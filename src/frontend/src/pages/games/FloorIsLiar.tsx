import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface FloorIsLiarProps {
  onNavigate: (page: ModulePage) => void;
}

export default function FloorIsLiar({ onNavigate }: FloorIsLiarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  
  const gameStateRef = useRef({
    player: { x: 100, y: 500, vx: 0, vy: 0, onGround: false },
    platforms: [] as { x: number; y: number; width: number; label: string; actualSafe: boolean }[],
    goal: { x: 700, y: 100 },
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 100, y: 500, vx: 0, vy: 0, onGround: false };
    state.goal = { x: 700, y: 100 };
    state.platforms = [];
    
    // Create platforms with lying labels
    state.platforms.push({ x: 0, y: 550, width: 200, label: 'SAFE', actualSafe: true });
    
    for (let i = 0; i < 6 + level; i++) {
      const actualSafe = Math.random() > 0.5;
      const labelLies = Math.random() > 0.6;
      const label = (actualSafe !== labelLies) ? 'SAFE' : 'DANGER';
      
      state.platforms.push({
        x: 150 + i * 100,
        y: 500 - i * 60,
        width: 90,
        label: label,
        actualSafe: actualSafe,
      });
    }
    
    state.platforms.push({ x: 650, y: 150, width: 150, label: 'SAFE', actualSafe: true });
    
    setGameOver(false);
  };

  const handleRestart = () => {
    setLevel(1);
    setScore(0);
    initGame();
  };

  useEffect(() => {
    initGame();
  }, [level]);

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
        // Player movement
        const speed = 4;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.player.vx = -speed;
        else if (state.keys['ArrowRight'] || state.keys['d']) state.player.vx = speed;
        else state.player.vx *= 0.8;

        // Jump
        if ((state.keys['ArrowUp'] || state.keys['w'] || state.keys[' ']) && state.player.onGround) {
          state.player.vy = -12;
          state.player.onGround = false;
        }

        // Gravity
        state.player.vy += 0.5;
        state.player.x += state.player.vx;
        state.player.y += state.player.vy;

        state.player.x = Math.max(20, Math.min(780, state.player.x));

        // Platform collision
        state.player.onGround = false;
        state.platforms.forEach(platform => {
          if (
            state.player.x + 15 > platform.x &&
            state.player.x - 15 < platform.x + platform.width &&
            state.player.y + 15 > platform.y &&
            state.player.y + 15 < platform.y + 20 &&
            state.player.vy > 0
          ) {
            if (!platform.actualSafe) {
              setGameOver(true);
              if (score > highScore) setHighScore(score);
            } else {
              state.player.y = platform.y - 15;
              state.player.vy = 0;
              state.player.onGround = true;
            }
          }
        });

        // Check goal
        const dx = state.goal.x - state.player.x;
        const dy = state.goal.y - state.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 40) {
          setScore(s => s + level * 10);
          setLevel(l => l + 1);
        }

        // Fall off
        if (state.player.y > 650) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      // Render
      ctx.fillStyle = '#1a1a2e';
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

      // Platforms
      state.platforms.forEach(platform => {
        const color = platform.label === 'SAFE' ? '#22c55e' : '#ef4444';
        ctx.fillStyle = color;
        ctx.fillRect(platform.x, platform.y, platform.width, 20);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, 20);
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(platform.label, platform.x + platform.width / 2, platform.y + 14);
      });

      // Player
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 280, 100);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('⚠️ The Floor Is a Liar! ⚠️', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText('Labels might be wrong!', 20, 60);
      ctx.fillText('Test carefully or memorize!', 20, 80);
      ctx.fillText(`Level: ${level}`, 20, 100);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore, level]);

  return (
    <GameLayout
      title="The Floor Is a Liar 🤥"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-red-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Don't trust the platform labels!</p>
          <p className="text-sm">Arrow keys/WASD • Space to jump • Test platforms carefully</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-red-500 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
