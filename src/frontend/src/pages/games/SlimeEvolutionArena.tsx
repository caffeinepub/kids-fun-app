import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface SlimeEvolutionArenaProps {
  onNavigate: (page: ModulePage) => void;
}

interface Enemy {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'normal' | 'magnet' | 'explosive';
}

type SlimeForm = 'normal' | 'magnet' | 'explosive' | 'giant';

export default function SlimeEvolutionArena({ onNavigate }: SlimeEvolutionArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    slimeX: 400,
    slimeY: 300,
    slimeSize: 30,
    slimeForm: 'normal' as SlimeForm,
    enemies: [] as Enemy[],
    spawnTimer: 0,
    formTimer: 0,
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    gameStateRef.current = {
      slimeX: 400,
      slimeY: 300,
      slimeSize: 30,
      slimeForm: 'normal',
      enemies: [],
      spawnTimer: 0,
      formTimer: 0,
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
        if (state.keys['ArrowLeft'] || state.keys['a']) state.slimeX -= speed;
        if (state.keys['ArrowRight'] || state.keys['d']) state.slimeX += speed;
        if (state.keys['ArrowUp'] || state.keys['w']) state.slimeY -= speed;
        if (state.keys['ArrowDown'] || state.keys['s']) state.slimeY += speed;

        // Boundaries
        state.slimeX = Math.max(state.slimeSize, Math.min(canvas.width - state.slimeSize, state.slimeX));
        state.slimeY = Math.max(state.slimeSize, Math.min(canvas.height - state.slimeSize, state.slimeY));

        // Spawn enemies
        state.spawnTimer += deltaTime;
        if (state.spawnTimer > 2000) {
          state.spawnTimer = 0;
          const types: ('normal' | 'magnet' | 'explosive')[] = ['normal', 'magnet', 'explosive'];
          const angle = Math.random() * Math.PI * 2;
          state.enemies.push({
            x: 400 + Math.cos(angle) * 400,
            y: 300 + Math.sin(angle) * 300,
            vx: -Math.cos(angle) * 2,
            vy: -Math.sin(angle) * 2,
            type: types[Math.floor(Math.random() * types.length)],
          });
        }

        // Form timer
        if (state.slimeForm !== 'normal') {
          state.formTimer += deltaTime;
          if (state.formTimer > 5000) {
            state.slimeForm = 'normal';
            state.formTimer = 0;
          }
        }

        // Move enemies
        state.enemies.forEach((enemy, idx) => {
          // Magnet slime attracts enemies
          if (state.slimeForm === 'magnet') {
            const dx = state.slimeX - enemy.x;
            const dy = state.slimeY - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            enemy.vx += (dx / dist) * 0.1;
            enemy.vy += (dy / dist) * 0.1;
          }

          enemy.x += enemy.vx;
          enemy.y += enemy.vy;

          // Check collision with slime
          const dx = enemy.x - state.slimeX;
          const dy = enemy.y - state.slimeY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < state.slimeSize + 15) {
            state.enemies.splice(idx, 1);
            state.slimeSize += 2;
            setScore(s => s + 10);

            // Evolve based on absorbed enemy
            if (enemy.type === 'magnet' && state.slimeForm === 'normal') {
              state.slimeForm = 'magnet';
              state.formTimer = 0;
            } else if (enemy.type === 'explosive' && state.slimeForm === 'normal') {
              state.slimeForm = 'explosive';
              state.formTimer = 0;
              // Explosion effect
              state.enemies = state.enemies.filter(e => {
                const edx = e.x - state.slimeX;
                const edy = e.y - state.slimeY;
                const edist = Math.sqrt(edx * edx + edy * edy);
                if (edist < 150) {
                  setScore(s => s + 5);
                  return false;
                }
                return true;
              });
            }

            // Giant form
            if (state.slimeSize > 80) {
              state.slimeForm = 'giant';
            }
          }

          // Remove off-screen enemies
          if (enemy.x < -50 || enemy.x > canvas.width + 50 || enemy.y < -50 || enemy.y > canvas.height + 50) {
            state.enemies.splice(idx, 1);
          }
        });

        // Game over if too many enemies
        if (state.enemies.length > 20) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      // Render
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw arena circle
      ctx.strokeStyle = '#4ECDC4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(400, 300, 350, 0, Math.PI * 2);
      ctx.stroke();

      // Draw enemies
      state.enemies.forEach(enemy => {
        if (enemy.type === 'normal') {
          ctx.fillStyle = '#FF6B6B';
        } else if (enemy.type === 'magnet') {
          ctx.fillStyle = '#4169E1';
        } else {
          ctx.fillStyle = '#FFA500';
        }
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw slime
      let slimeColor = '#4CAF50';
      if (state.slimeForm === 'magnet') slimeColor = '#4169E1';
      else if (state.slimeForm === 'explosive') slimeColor = '#FFA500';
      else if (state.slimeForm === 'giant') slimeColor = '#8B008B';

      ctx.fillStyle = slimeColor;
      ctx.beginPath();
      ctx.arc(state.slimeX, state.slimeY, state.slimeSize, 0, Math.PI * 2);
      ctx.fill();

      // Slime face
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(state.slimeX - 10, state.slimeY - 5, 5, 0, Math.PI * 2);
      ctx.arc(state.slimeX + 10, state.slimeY - 5, 5, 0, Math.PI * 2);
      ctx.fill();

      // UI
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Size: ${state.slimeSize}`, 10, 30);
      ctx.fillText(`Form: ${state.slimeForm}`, 10, 60);
      ctx.fillText(`Enemies: ${state.enemies.length}`, 10, 90);

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
      title="Slime Evolution Arena 🟢"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-900 to-teal-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Arrow keys or WASD to move</p>
          <p className="text-sm">Absorb enemies to evolve into different slime forms!</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-green-400 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
