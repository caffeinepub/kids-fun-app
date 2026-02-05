import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface BossFightOnlyProps {
  onNavigate: (page: ModulePage) => void;
}

interface Boss {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  phase: number;
  attackTimer: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function BossFightOnly({ onNavigate }: BossFightOnlyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bossNumber, setBossNumber] = useState(1);
  const gameStateRef = useRef({
    playerX: 400,
    playerY: 500,
    playerHealth: 100,
    boss: null as Boss | null,
    projectiles: [] as Projectile[],
    reversedControls: false,
    gravityReversed: false,
    keys: {} as Record<string, boolean>,
  });

  const initBoss = (bossNum: number) => {
    const boss: Boss = {
      x: 400,
      y: 150,
      health: 100 + bossNum * 50,
      maxHealth: 100 + bossNum * 50,
      phase: 1,
      attackTimer: 0,
    };

    gameStateRef.current.boss = boss;
    gameStateRef.current.projectiles = [];
    gameStateRef.current.playerHealth = 100;
    gameStateRef.current.reversedControls = bossNum === 2;
    gameStateRef.current.gravityReversed = bossNum === 3;
  };

  const initGame = () => {
    setBossNumber(1);
    initBoss(1);
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
      if (e.key === ' ' && !gameOver) {
        // Player attack
        const state = gameStateRef.current;
        if (state.boss) {
          const dx = state.boss.x - state.playerX;
          const dy = state.boss.y - state.playerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            state.boss.health -= 10;
            setScore(s => s + 10);
            if (state.boss.health <= 0) {
              if (bossNumber < 3) {
                setBossNumber(b => b + 1);
                initBoss(bossNumber + 1);
              } else {
                setGameOver(true);
                if (score > highScore) setHighScore(score);
              }
            }
          }
        }
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

      if (!gameOver && state.boss) {
        // Player movement
        const speed = 4;
        const leftKey = state.reversedControls ? 'ArrowRight' : 'ArrowLeft';
        const rightKey = state.reversedControls ? 'ArrowLeft' : 'ArrowRight';
        
        if (state.keys[leftKey] || state.keys['a']) state.playerX -= speed;
        if (state.keys[rightKey] || state.keys['d']) state.playerX += speed;

        // Boundaries
        state.playerX = Math.max(30, Math.min(canvas.width - 30, state.playerX));

        // Boss attacks
        state.boss.attackTimer += deltaTime;
        if (state.boss.attackTimer > 2000) {
          state.boss.attackTimer = 0;
          const angle = Math.atan2(state.playerY - state.boss.y, state.playerX - state.boss.x);
          state.projectiles.push({
            x: state.boss.x,
            y: state.boss.y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
          });
        }

        // Update projectiles
        state.projectiles.forEach((proj, idx) => {
          proj.x += proj.vx;
          proj.y += proj.vy;

          // Check collision with player
          const dx = proj.x - state.playerX;
          const dy = proj.y - state.playerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30) {
            state.playerHealth -= 10;
            state.projectiles.splice(idx, 1);
            if (state.playerHealth <= 0) {
              setGameOver(true);
              if (score > highScore) setHighScore(score);
            }
          }

          // Remove off-screen projectiles
          if (proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
            state.projectiles.splice(idx, 1);
          }
        });
      }

      // Render
      ctx.fillStyle = state.gravityReversed ? '#1a1a2e' : '#16213e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw boss
      if (state.boss) {
        ctx.fillStyle = '#FF1744';
        ctx.fillRect(state.boss.x - 50, state.boss.y - 50, 100, 100);
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('👹', state.boss.x, state.boss.y + 15);

        // Boss health bar
        ctx.fillStyle = '#333';
        ctx.fillRect(state.boss.x - 60, state.boss.y - 70, 120, 10);
        ctx.fillStyle = '#FF1744';
        ctx.fillRect(state.boss.x - 60, state.boss.y - 70, 120 * (state.boss.health / state.boss.maxHealth), 10);
      }

      // Draw projectiles
      state.projectiles.forEach(proj => {
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw player
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚔️', state.playerX, state.playerY + 10);

      // Player health bar
      ctx.fillStyle = '#333';
      ctx.fillRect(10, canvas.height - 30, 200, 20);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(10, canvas.height - 30, 200 * (state.playerHealth / 100), 20);

      // UI
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Boss ${bossNumber}/3`, 10, 30);
      if (state.reversedControls) {
        ctx.fillText('Controls Reversed!', 10, 60);
      }
      if (state.gravityReversed) {
        ctx.fillText('Gravity Reversed!', 10, 90);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore, bossNumber]);

  return (
    <GameLayout
      title="Boss Fight Only ⚔️"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-900 to-purple-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Arrow keys or AD to move • Space to attack</p>
          <p className="text-sm">Defeat 3 bosses with unique mechanics!</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-red-600 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
