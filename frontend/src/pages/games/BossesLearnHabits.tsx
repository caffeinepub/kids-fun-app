import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface BossesLearnHabitsProps {
  onNavigate: (page: ModulePage) => void;
}

export default function BossesLearnHabits({ onNavigate }: BossesLearnHabitsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 400, y: 500, health: 100 },
    boss: { x: 400, y: 150, health: 100, phase: 1 },
    projectiles: [] as { x: number; y: number; vx: number; vy: number }[],
    playerMoves: [] as { direction: string; time: number }[],
    attackTimer: 0,
    learnedPattern: [] as string[],
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 400, y: 500, health: 100 };
    state.boss = { x: 400, y: 150, health: 100, phase: 1 };
    state.projectiles = [];
    state.playerMoves = [];
    state.learnedPattern = [];
    state.attackTimer = 0;
    
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
      state.keys[e.key] = true;
      
      // Record player moves for boss to learn
      const direction = e.key;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'].includes(direction)) {
        state.playerMoves.push({ direction, time: Date.now() });
        if (state.playerMoves.length > 20) {
          state.playerMoves.shift();
        }
      }
      
      // Attack with spacebar
      if (e.key === ' ') {
        // Player shoots at boss
        const dx = state.boss.x - state.player.x;
        const dy = state.boss.y - state.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const vx = (dx / dist) * 8;
        const vy = (dy / dist) * 8;
        
        state.projectiles.push({
          x: state.player.x,
          y: state.player.y,
          vx: vx,
          vy: vy,
        });
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
        // Player movement
        const speed = 5;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= speed;
        if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += speed;
        if (state.keys['ArrowUp'] || state.keys['w']) state.player.y -= speed;
        if (state.keys['ArrowDown'] || state.keys['s']) state.player.y += speed;

        state.player.x = Math.max(30, Math.min(770, state.player.x));
        state.player.y = Math.max(350, Math.min(570, state.player.y));

        // Boss learns player patterns
        state.attackTimer += 16;
        if (state.attackTimer > 2000) {
          state.attackTimer = 0;
          
          // Boss predicts where player will be based on movement history
          if (state.playerMoves.length > 5) {
            const recentMoves = state.playerMoves.slice(-5);
            const leftCount = recentMoves.filter(m => m.direction === 'ArrowLeft' || m.direction === 'a').length;
            const rightCount = recentMoves.filter(m => m.direction === 'ArrowRight' || m.direction === 'd').length;
            
            let predictedX = state.player.x;
            if (leftCount > rightCount) predictedX -= 100;
            else if (rightCount > leftCount) predictedX += 100;
            
            // Boss shoots at predicted position
            const dx = predictedX - state.boss.x;
            const dy = state.player.y - state.boss.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const vx = (dx / dist) * 5;
            const vy = (dy / dist) * 5;
            
            state.projectiles.push({
              x: state.boss.x,
              y: state.boss.y,
              vx: vx,
              vy: vy,
            });
          }
        }

        // Update projectiles
        state.projectiles = state.projectiles.filter(proj => {
          proj.x += proj.vx;
          proj.y += proj.vy;
          
          // Check if hits boss
          const bossD = Math.sqrt(Math.pow(proj.x - state.boss.x, 2) + Math.pow(proj.y - state.boss.y, 2));
          if (bossD < 50 && proj.vy < 0) {
            state.boss.health -= 10;
            setScore(s => s + 10);
            return false;
          }
          
          // Check if hits player
          const playerD = Math.sqrt(Math.pow(proj.x - state.player.x, 2) + Math.pow(proj.y - state.player.y, 2));
          if (playerD < 30 && proj.vy > 0) {
            state.player.health -= 10;
            return false;
          }
          
          return proj.x > 0 && proj.x < 800 && proj.y > 0 && proj.y < 600;
        });

        // Check win/lose
        if (state.boss.health <= 0) {
          setScore(s => s + 100);
          setGameOver(true);
          if (score + 100 > highScore) setHighScore(score + 100);
        }
        
        if (state.player.health <= 0) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      // Render
      ctx.fillStyle = '#0f0a1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Arena boundary
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, 760, 560);

      // Boss
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(state.boss.x, state.boss.y, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('👹', state.boss.x, state.boss.y + 15);
      
      // Boss health bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(state.boss.x - 60, state.boss.y - 70, 120, 15);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(state.boss.x - 60, state.boss.y - 70, (state.boss.health / 100) * 120, 15);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(state.boss.x - 60, state.boss.y - 70, 120, 15);

      // Projectiles
      state.projectiles.forEach(proj => {
        ctx.fillStyle = proj.vy < 0 ? '#3b82f6' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // Player
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 320, 120);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('🧠 Boss Learns Your Habits!', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText(`Player Health: ${state.player.health}`, 20, 60);
      ctx.fillText(`Boss Health: ${state.boss.health}`, 20, 80);
      ctx.fillText('SPACE to shoot • Move to dodge', 20, 100);
      ctx.fillText('Boss predicts your movements!', 20, 120);

      // Player health bar
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(20, 125, 300, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(20, 125, (state.player.health / 100) * 300, 10);

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
      title="Bosses Learn Your Habits 🧠"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-red-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">The boss adapts to your playstyle!</p>
          <p className="text-sm">Arrow keys/WASD to move • SPACE to shoot • Stay unpredictable!</p>
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
