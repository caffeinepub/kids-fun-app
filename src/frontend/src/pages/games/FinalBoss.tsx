import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface FinalBossProps {
  onNavigate: (page: ModulePage) => void;
}

interface Trap {
  x: number;
  y: number;
  type: 'spike' | 'fire' | 'arrow';
  active: boolean;
}

interface Hero {
  x: number;
  y: number;
  health: number;
  vx: number;
}

export default function FinalBoss({ onNavigate }: FinalBossProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wave, setWave] = useState(1);
  const gameStateRef = useRef({
    bossHealth: 100,
    traps: [] as Trap[],
    heroes: [] as Hero[],
    spawnTimer: 0,
    selectedTrap: 'spike' as 'spike' | 'fire' | 'arrow',
  });

  const initGame = () => {
    gameStateRef.current = {
      bossHealth: 100,
      traps: [],
      heroes: [],
      spawnTimer: 0,
      selectedTrap: 'spike',
    };
    setScore(0);
    setWave(1);
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

    const handleClick = (e: MouseEvent) => {
      if (gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const state = gameStateRef.current;
      if (state.traps.length < 10) {
        state.traps.push({
          x,
          y,
          type: state.selectedTrap,
          active: true,
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === '1') state.selectedTrap = 'spike';
      if (e.key === '2') state.selectedTrap = 'fire';
      if (e.key === '3') state.selectedTrap = 'arrow';
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    let animationId: number;
    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      const state = gameStateRef.current;

      if (!gameOver) {
        // Spawn heroes
        state.spawnTimer += deltaTime;
        if (state.spawnTimer > 3000 - wave * 200) {
          state.spawnTimer = 0;
          state.heroes.push({
            x: 0,
            y: 500,
            health: 50,
            vx: 1 + wave * 0.2,
          });
        }

        // Move heroes
        state.heroes.forEach((hero, idx) => {
          hero.x += hero.vx;

          // Check trap collision
          state.traps.forEach(trap => {
            if (trap.active) {
              const dx = trap.x - hero.x;
              const dy = trap.y - hero.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 40) {
                hero.health -= trap.type === 'fire' ? 30 : trap.type === 'arrow' ? 50 : 20;
                if (trap.type !== 'fire') trap.active = false;
                if (hero.health <= 0) {
                  state.heroes.splice(idx, 1);
                  setScore(s => s + 10);
                }
              }
            }
          });

          // Check if hero reached boss
          if (hero.x > 750) {
            state.bossHealth -= 10;
            state.heroes.splice(idx, 1);
            if (state.bossHealth <= 0) {
              setGameOver(true);
              if (score > highScore) setHighScore(score);
            }
          }
        });

        // Wave progression
        if (state.heroes.length === 0 && state.spawnTimer > 2000) {
          setWave(w => w + 1);
        }
      }

      // Render
      ctx.fillStyle = '#2C1810';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw dungeon floor
      ctx.fillStyle = '#4A4A4A';
      ctx.fillRect(0, 520, canvas.width, 80);

      // Draw traps
      state.traps.forEach(trap => {
        if (trap.active) {
          if (trap.type === 'spike') {
            ctx.fillStyle = '#888';
            ctx.beginPath();
            ctx.moveTo(trap.x, trap.y - 20);
            ctx.lineTo(trap.x - 15, trap.y + 10);
            ctx.lineTo(trap.x + 15, trap.y + 10);
            ctx.closePath();
            ctx.fill();
          } else if (trap.type === 'fire') {
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(trap.x, trap.y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🔥', trap.x, trap.y + 8);
          } else {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(trap.x - 10, trap.y - 5, 20, 10);
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('➡️', trap.x, trap.y + 5);
          }
        }
      });

      // Draw heroes
      state.heroes.forEach(hero => {
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(hero.x - 15, hero.y - 30, 30, 40);
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️', hero.x, hero.y - 5);

        // Health bar
        ctx.fillStyle = '#333';
        ctx.fillRect(hero.x - 20, hero.y - 40, 40, 5);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(hero.x - 20, hero.y - 40, 40 * (hero.health / 50), 5);
      });

      // Draw boss (you)
      ctx.fillStyle = '#8B008B';
      ctx.fillRect(750, 450, 40, 60);
      ctx.fillStyle = '#fff';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('👑', 770, 475);

      // Boss health bar
      ctx.fillStyle = '#333';
      ctx.fillRect(650, 400, 150, 20);
      ctx.fillStyle = '#8B008B';
      ctx.fillRect(650, 400, 150 * (state.bossHealth / 100), 20);

      // UI
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Wave: ${wave}`, 10, 30);
      ctx.fillText(`Traps: ${state.traps.filter(t => t.active).length}/10`, 10, 60);
      ctx.fillText('1: Spike  2: Fire  3: Arrow', 10, 90);
      
      // Selected trap indicator
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(10, 100, 200, 40);
      ctx.fillStyle = '#000';
      ctx.fillText(`Selected: ${state.selectedTrap}`, 20, 125);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, score, highScore, wave]);

  return (
    <GameLayout
      title="You Are the Final Boss 👑"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-black">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Click to place traps • 1/2/3 to select trap type</p>
          <p className="text-sm">Defend your dungeon from heroes!</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-purple-600 rounded-lg shadow-lg cursor-crosshair"
        />
      </div>
    </GameLayout>
  );
}
