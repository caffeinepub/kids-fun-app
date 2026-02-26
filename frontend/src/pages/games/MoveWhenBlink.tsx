import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface MoveWhenBlinkProps {
  onNavigate: (page: ModulePage) => void;
}

export default function MoveWhenBlink({ onNavigate }: MoveWhenBlinkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 100, y: 500 },
    enemies: [] as { x: number; y: number; vx: number; vy: number }[],
    goal: { x: 700, y: 100 },
    blinkTimer: 0,
    blinkDuration: 0,
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 100, y: 500 };
    state.goal = { x: 700, y: 100 };
    state.enemies = [];
    state.blinkTimer = 0;
    state.blinkDuration = 0;
    
    // Create enemies
    for (let i = 0; i < 6; i++) {
      state.enemies.push({
        x: 200 + i * 100,
        y: 200 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
      });
    }
    
    setScore(0);
    setGameOver(false);
    setIsBlinking(false);
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
      state.keys[e.key] = true;
      
      // Blink with spacebar
      if (e.key === ' ' && state.blinkTimer <= 0) {
        state.blinkTimer = 300; // 300ms blink
        state.blinkDuration = 300;
        setIsBlinking(true);
      }
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
        // Blink timer
        if (state.blinkTimer > 0) {
          state.blinkTimer -= 16;
          if (state.blinkTimer <= 0) {
            setIsBlinking(false);
          }
        }

        // Player can only move while blinking
        if (state.blinkTimer > 0) {
          const speed = 6;
          if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= speed;
          if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += speed;
          if (state.keys['ArrowUp'] || state.keys['w']) state.player.y -= speed;
          if (state.keys['ArrowDown'] || state.keys['s']) state.player.y += speed;

          state.player.x = Math.max(20, Math.min(780, state.player.x));
          state.player.y = Math.max(20, Math.min(580, state.player.y));
        }

        // Update enemies
        state.enemies.forEach(enemy => {
          enemy.x += enemy.vx;
          enemy.y += enemy.vy;
          
          if (enemy.x < 50 || enemy.x > 750) enemy.vx *= -1;
          if (enemy.y < 50 || enemy.y > 550) enemy.vy *= -1;
          
          // Check collision (only when not blinking)
          if (state.blinkTimer <= 0) {
            const dx = enemy.x - state.player.x;
            const dy = enemy.y - state.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 40) {
              setGameOver(true);
              if (score > highScore) setHighScore(score);
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

        // Score for survival
        setScore(s => s + 0.1);
      }

      // Render
      ctx.fillStyle = state.blinkTimer > 0 ? '#000000' : '#1e1b4b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (state.blinkTimer <= 0) {
        // Goal
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(state.goal.x, state.goal.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏁', state.goal.x, state.goal.y + 10);

        // Enemies
        state.enemies.forEach(enemy => {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = '28px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('👁️', enemy.x, enemy.y + 10);
        });

        // Player
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        // During blink - show only player
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Blink effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('👁️ BLINKING', 400, 300);
      }

      // UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 300, 100);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('👁️ You Can Only Move When You Blink!', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText('Press SPACE to blink', 20, 60);
      ctx.fillText('Move with arrows/WASD while blinking', 20, 80);
      ctx.fillText('Enemies freeze when you blink!', 20, 100);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore, isBlinking]);

  return (
    <GameLayout
      title="You Can Only Move When You Blink 👁️"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-black">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Blink to move!</p>
          <p className="text-sm">SPACE to blink • Arrow keys/WASD to move • Reach the goal</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-indigo-500 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
