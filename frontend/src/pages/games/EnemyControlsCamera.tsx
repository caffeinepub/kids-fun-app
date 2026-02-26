import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface EnemyControlsCameraProps {
  onNavigate: (page: ModulePage) => void;
}

export default function EnemyControlsCamera({ onNavigate }: EnemyControlsCameraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 400, y: 300 },
    camera: { x: 0, y: 0, targetX: 0, targetY: 0 },
    enemy: { x: 600, y: 200, vx: 2, vy: 2 },
    coins: [] as { x: number; y: number; collected: boolean }[],
    goal: { x: 700, y: 100 },
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 400, y: 300 };
    state.camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
    state.enemy = { x: 600, y: 200, vx: 2, vy: 2 };
    state.goal = { x: 700, y: 100 };
    state.coins = [];
    
    // Spawn coins
    for (let i = 0; i < 10; i++) {
      state.coins.push({
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 400,
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
        // Player movement
        const speed = 4;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= speed;
        if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += speed;
        if (state.keys['ArrowUp'] || state.keys['w']) state.player.y -= speed;
        if (state.keys['ArrowDown'] || state.keys['s']) state.player.y += speed;

        state.player.x = Math.max(20, Math.min(780, state.player.x));
        state.player.y = Math.max(20, Math.min(580, state.player.y));

        // Enemy movement (controls camera)
        state.enemy.x += state.enemy.vx;
        state.enemy.y += state.enemy.vy;
        
        if (state.enemy.x < 100 || state.enemy.x > 700) state.enemy.vx *= -1;
        if (state.enemy.y < 100 || state.enemy.y > 500) state.enemy.vy *= -1;

        // Camera follows enemy instead of player!
        state.camera.targetX = state.enemy.x - 400;
        state.camera.targetY = state.enemy.y - 300;
        
        // Smooth camera movement
        state.camera.x += (state.camera.targetX - state.camera.x) * 0.1;
        state.camera.y += (state.camera.targetY - state.camera.y) * 0.1;

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

        // Check if enemy catches player
        const dx = state.enemy.x - state.player.x;
        const dy = state.enemy.y - state.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 40) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }

        // Check goal
        const gdx = state.goal.x - state.player.x;
        const gdy = state.goal.y - state.player.y;
        const gdist = Math.sqrt(gdx * gdx + gdy * gdy);
        if (gdist < 40) {
          setScore(s => s + 100);
          setGameOver(true);
          if (score + 100 > highScore) setHighScore(score + 100);
        }
      }

      // Render
      ctx.save();
      ctx.translate(-state.camera.x, -state.camera.y);

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(state.camera.x, state.camera.y, 800, 600);

      // Grid (to show camera movement)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = -200; i < 1000; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, -200);
        ctx.lineTo(i, 800);
        ctx.stroke();
      }
      for (let i = -200; i < 800; i += 50) {
        ctx.beginPath();
        ctx.moveTo(-200, i);
        ctx.lineTo(1000, i);
        ctx.stroke();
      }

      // Goal
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(state.goal.x, state.goal.y, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏁', state.goal.x, state.goal.y + 10);

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

      // Enemy (camera controller)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(state.enemy.x, state.enemy.y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📹', state.enemy.x, state.enemy.y + 10);
      
      // Camera indicator
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(state.enemy.x, state.enemy.y, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();

      // UI (fixed to screen)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 320, 100);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('📹 Enemy Controls the Camera!', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText('Camera follows the enemy, not you!', 20, 60);
      ctx.fillText('Navigate carefully to reach the goal', 20, 80);
      ctx.fillText('Avoid the camera controller!', 20, 100);

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
      title="Enemy Controls the Camera 📹"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">The camera doesn't follow you!</p>
          <p className="text-sm">Arrow keys/WASD to move • Navigate without camera help</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-blue-500 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
