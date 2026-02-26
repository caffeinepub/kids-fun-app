import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface TutorialIsVillainProps {
  onNavigate: (page: ModulePage) => void;
}

export default function TutorialIsVillain({ onNavigate }: TutorialIsVillainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 100, y: 500, health: 100 },
    tutorial: { x: 400, y: 100, phase: 0 },
    tutorialMessages: [
      "Welcome! Let me teach you...",
      "Press SPACE to jump... INTO DANGER!",
      "Collect coins... THAT HURT YOU!",
      "Avoid red... JUST KIDDING, AVOID GREEN!",
      "I'm not helping, I'm the villain! 😈",
    ],
    currentMessage: 0,
    messageTimer: 0,
    traps: [] as { x: number; y: number; active: boolean }[],
    fakeCoin: { x: 400, y: 300, visible: true },
    goal: { x: 700, y: 100 },
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 100, y: 500, health: 100 };
    state.tutorial = { x: 400, y: 100, phase: 0 };
    state.currentMessage = 0;
    state.messageTimer = 0;
    state.traps = [];
    state.fakeCoin = { x: 400, y: 300, visible: true };
    state.goal = { x: 700, y: 100 };
    
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
      
      // Tutorial spawns traps when player presses space
      if (e.key === ' ') {
        state.traps.push({
          x: state.player.x,
          y: state.player.y - 50,
          active: true,
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
        // Tutorial message timer
        state.messageTimer += 16;
        if (state.messageTimer > 3000 && state.currentMessage < state.tutorialMessages.length - 1) {
          state.messageTimer = 0;
          state.currentMessage++;
          
          // Tutorial does evil things
          if (state.currentMessage === 2) {
            // Spawn fake coins that hurt
            state.fakeCoin.visible = true;
          } else if (state.currentMessage === 3) {
            // Spawn traps
            for (let i = 0; i < 5; i++) {
              state.traps.push({
                x: 200 + i * 100,
                y: 400,
                active: true,
              });
            }
          }
        }

        // Player movement
        const speed = 4;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= speed;
        if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += speed;
        if (state.keys['ArrowUp'] || state.keys['w']) state.player.y -= speed;
        if (state.keys['ArrowDown'] || state.keys['s']) state.player.y += speed;

        state.player.x = Math.max(20, Math.min(780, state.player.x));
        state.player.y = Math.max(20, Math.min(580, state.player.y));

        // Check fake coin
        if (state.fakeCoin.visible) {
          const dx = state.fakeCoin.x - state.player.x;
          const dy = state.fakeCoin.y - state.player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30) {
            state.fakeCoin.visible = false;
            state.player.health -= 20;
          }
        }

        // Check traps
        state.traps.forEach(trap => {
          if (trap.active) {
            const dx = trap.x - state.player.x;
            const dy = trap.y - state.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              trap.active = false;
              state.player.health -= 15;
            }
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

      // Fake coin
      if (state.fakeCoin.visible) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(state.fakeCoin.x, state.fakeCoin.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💀', state.fakeCoin.x, state.fakeCoin.y + 7);
      }

      // Traps
      state.traps.forEach(trap => {
        if (trap.active) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(trap.x, trap.y, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('💥', trap.x, trap.y + 8);
        }
      });

      // Tutorial (villain)
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(state.tutorial.x, state.tutorial.y, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('😈', state.tutorial.x, state.tutorial.y + 15);

      // Tutorial message
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(50, 150, 700, 80);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 150, 700, 80);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('😈 Evil Tutorial:', 400, 180);
      ctx.font = '18px Arial';
      ctx.fillText(state.tutorialMessages[state.currentMessage], 400, 210);

      // Player
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 300, 80);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('😈 The Tutorial Is the Villain!', 20, 35);
      ctx.font = '14px Arial';
      ctx.fillText(`Health: ${Math.floor(state.player.health)}`, 20, 60);
      ctx.fillText("Don't trust the tutorial!", 20, 80);

      // Health bar
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(20, 85, 280, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(20, 85, (state.player.health / 100) * 280, 10);

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
      title="The Tutorial Is the Villain 😈"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-black">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">The tutorial is trying to trick you!</p>
          <p className="text-sm">Arrow keys/WASD to move • Don't trust the advice • Survive!</p>
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
