import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface InventoryIsEnemyProps {
  onNavigate: (page: ModulePage) => void;
}

export default function InventoryIsEnemy({ onNavigate }: InventoryIsEnemyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 400, y: 300, speed: 5, health: 100 },
    inventory: [] as { name: string; weight: number; damage: number }[],
    items: [] as { x: number; y: number; name: string; weight: number; collected: boolean }[],
    enemies: [] as { x: number; y: number; vx: number; vy: number }[],
    goal: { x: 700, y: 100 },
    keys: {} as Record<string, boolean>,
  });

  const itemTypes = [
    { name: '🗡️ Sword', weight: 15, damage: 2 },
    { name: '🛡️ Shield', weight: 20, damage: 1 },
    { name: '📦 Box', weight: 25, damage: 0 },
    { name: '⚔️ Axe', weight: 18, damage: 2 },
    { name: '📚 Book', weight: 10, damage: 0 },
  ];

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 100, y: 500, speed: 5, health: 100 };
    state.inventory = [];
    state.items = [];
    state.enemies = [];
    state.goal = { x: 700, y: 100 };
    
    // Spawn items
    for (let i = 0; i < 8; i++) {
      const item = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      state.items.push({
        x: 150 + i * 100,
        y: 200 + Math.random() * 300,
        name: item.name,
        weight: item.weight,
        collected: false,
      });
    }
    
    // Spawn enemies
    for (let i = 0; i < 5; i++) {
      state.enemies.push({
        x: 200 + i * 120,
        y: 150 + i * 80,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
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
      state.keys[e.key] = true;
      
      // Drop item with E key
      if (e.key === 'e' && state.inventory.length > 0) {
        state.inventory.pop();
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
        // Calculate total weight
        const totalWeight = state.inventory.reduce((sum, item) => sum + item.weight, 0);
        const speedPenalty = Math.max(1, 5 - totalWeight / 10);
        state.player.speed = speedPenalty;
        
        // Damage from inventory
        if (totalWeight > 50) {
          state.player.health -= 0.2;
        }

        // Player movement
        if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= state.player.speed;
        if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += state.player.speed;
        if (state.keys['ArrowUp'] || state.keys['w']) state.player.y -= state.player.speed;
        if (state.keys['ArrowDown'] || state.keys['s']) state.player.y += state.player.speed;

        state.player.x = Math.max(20, Math.min(780, state.player.x));
        state.player.y = Math.max(20, Math.min(580, state.player.y));

        // Collect items
        state.items.forEach(item => {
          if (!item.collected) {
            const dx = item.x - state.player.x;
            const dy = item.y - state.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              item.collected = true;
              state.inventory.push({
                name: item.name,
                weight: item.weight,
                damage: 0,
              });
            }
          }
        });

        // Update enemies
        state.enemies.forEach(enemy => {
          enemy.x += enemy.vx;
          enemy.y += enemy.vy;
          
          if (enemy.x < 20 || enemy.x > 780) enemy.vx *= -1;
          if (enemy.y < 20 || enemy.y > 580) enemy.vy *= -1;
          
          // Check collision
          const dx = enemy.x - state.player.x;
          const dy = enemy.y - state.player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 35) {
            state.player.health -= 1;
          }
        });

        // Check health
        if (state.player.health <= 0) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }

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
      ctx.fillStyle = '#0f172a';
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

      // Items
      state.items.forEach(item => {
        if (!item.collected) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(item.x - 15, item.y - 15, 30, 30);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.strokeRect(item.x - 15, item.y - 15, 30, 30);
          ctx.fillStyle = '#fff';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(item.name.split(' ')[0], item.x, item.y + 7);
        }
      });

      // Enemies
      state.enemies.forEach(enemy => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('👹', enemy.x, enemy.y + 8);
      });

      // Player
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inventory UI
      const totalWeight = state.inventory.reduce((sum, item) => sum + item.weight, 0);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 300, 150);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('⚠️ Inventory Slows You Down!', 20, 30);
      ctx.font = '14px Arial';
      ctx.fillText(`Weight: ${totalWeight} (Speed: ${state.player.speed.toFixed(1)})`, 20, 55);
      ctx.fillText(`Health: ${Math.floor(state.player.health)}`, 20, 75);
      ctx.fillText('Press E to drop last item', 20, 95);
      
      // Inventory list
      ctx.fillText('Inventory:', 20, 115);
      state.inventory.slice(-3).forEach((item, idx) => {
        ctx.fillText(`${item.name} (${item.weight})`, 30, 135 + idx * 20);
      });

      // Health bar
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(20, 155, 280, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(20, 155, (state.player.health / 100) * 280, 10);

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
      title="Inventory Is the Enemy 🎒"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Too many items will slow you down!</p>
          <p className="text-sm">Arrow keys/WASD to move • E to drop items • Reach the goal</p>
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
