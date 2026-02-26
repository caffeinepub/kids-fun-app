import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface EverythingIsButtonProps {
  onNavigate: (page: ModulePage) => void;
}

export default function EverythingIsButton({ onNavigate }: EverythingIsButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 400, y: 300 },
    buttons: [] as { x: number; y: number; width: number; height: number; action: string; color: string }[],
    goal: { x: 700, y: 100, visible: false },
    keys: {} as Record<string, boolean>,
  });

  const buttonActions = [
    { action: 'teleport', color: '#3b82f6', label: '🌀' },
    { action: 'spawn_enemy', color: '#ef4444', label: '👹' },
    { action: 'show_goal', color: '#22c55e', label: '🏁' },
    { action: 'reverse_controls', color: '#fbbf24', label: '🔄' },
    { action: 'speed_boost', color: '#8b5cf6', label: '⚡' },
  ];

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 100, y: 500 };
    state.goal = { x: 700, y: 100, visible: false };
    state.buttons = [];
    
    // Create buttons everywhere
    for (let i = 0; i < 15; i++) {
      const action = buttonActions[Math.floor(Math.random() * buttonActions.length)];
      state.buttons.push({
        x: 50 + Math.random() * 700,
        y: 50 + Math.random() * 500,
        width: 60,
        height: 60,
        action: action.action,
        color: action.color,
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

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const state = gameStateRef.current;
      
      // Check if clicked on a button
      state.buttons.forEach(button => {
        if (
          x > button.x &&
          x < button.x + button.width &&
          y > button.y &&
          y < button.y + button.height
        ) {
          // Execute button action
          if (button.action === 'teleport') {
            state.player.x = Math.random() * 700 + 50;
            state.player.y = Math.random() * 500 + 50;
          } else if (button.action === 'show_goal') {
            state.goal.visible = true;
            setScore(s => s + 20);
          } else if (button.action === 'spawn_enemy') {
            // Negative effect
            setScore(s => Math.max(0, s - 10));
          } else if (button.action === 'speed_boost') {
            setScore(s => s + 5);
          }
          
          // Move button to new location
          button.x = 50 + Math.random() * 700;
          button.y = 50 + Math.random() * 500;
        }
      });
    };

    canvas.addEventListener('click', handleClick);
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

        // Check goal
        if (state.goal.visible) {
          const dx = state.goal.x - state.player.x;
          const dy = state.goal.y - state.player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
            setScore(s => s + 100);
            setGameOver(true);
            if (score + 100 > highScore) setHighScore(score + 100);
          }
        }
      }

      // Render
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Buttons
      state.buttons.forEach(button => {
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        
        // Button label
        const action = buttonActions.find(a => a.action === button.action);
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(action?.label || '?', button.x + button.width / 2, button.y + button.height / 2 + 10);
      });

      // Goal (if visible)
      if (state.goal.visible) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(state.goal.x, state.goal.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏁', state.goal.x, state.goal.y + 10);
      }

      // Player
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
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
      ctx.fillText('🔘 Everything Is a Button!', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText('Click buttons to trigger effects', 20, 60);
      ctx.fillText('Find the green button to reveal goal', 20, 80);
      ctx.fillText('Arrow keys/WASD to move', 20, 100);
      ctx.fillText(`Goal visible: ${state.goal.visible ? 'YES' : 'NO'}`, 20, 120);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore]);

  return (
    <GameLayout
      title="Everything Is a Button 🔘"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Click everything to see what happens!</p>
          <p className="text-sm">Click buttons • Arrow keys/WASD to move • Find the goal</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-purple-500 rounded-lg shadow-lg cursor-pointer"
        />
      </div>
    </GameLayout>
  );
}
