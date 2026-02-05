import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface OneButtonHeroProps {
  onNavigate: (page: ModulePage) => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function OneButtonHero({ onNavigate }: OneButtonHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    playerY: 300,
    playerVY: 0,
    obstacles: [] as Obstacle[],
    obstacleTimer: 0,
    action: 'jump' as 'jump' | 'dash' | 'shield',
    actionCooldown: 0,
    buttonPressed: false,
    buttonPressTime: 0,
  });

  const initGame = () => {
    gameStateRef.current = {
      playerY: 300,
      playerVY: 0,
      obstacles: [],
      obstacleTimer: 0,
      action: 'jump',
      actionCooldown: 0,
      buttonPressed: false,
      buttonPressTime: 0,
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
      if (e.key === ' ' && !gameOver && !gameStateRef.current.buttonPressed) {
        gameStateRef.current.buttonPressed = true;
        gameStateRef.current.buttonPressTime = 0;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && gameStateRef.current.buttonPressed) {
        const state = gameStateRef.current;
        state.buttonPressed = false;
        
        if (state.actionCooldown <= 0) {
          if (state.buttonPressTime < 200) {
            // Tap - Jump
            state.playerVY = -12;
            state.actionCooldown = 500;
          } else if (state.buttonPressTime < 800) {
            // Hold - Dash
            state.action = 'dash';
            state.actionCooldown = 1000;
            setTimeout(() => {
              state.action = 'jump';
            }, 300);
          } else {
            // Long hold - Shield
            state.action = 'shield';
            state.actionCooldown = 1500;
            setTimeout(() => {
              state.action = 'jump';
            }, 500);
          }
        }
        state.buttonPressTime = 0;
      }
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
        // Track button press time
        if (state.buttonPressed) {
          state.buttonPressTime += deltaTime;
        }

        // Cooldown
        if (state.actionCooldown > 0) {
          state.actionCooldown -= deltaTime;
        }

        // Gravity
        if (state.action !== 'dash') {
          state.playerVY += 0.5;
          state.playerY += state.playerVY;
        }

        // Ground collision
        if (state.playerY > 450) {
          state.playerY = 450;
          state.playerVY = 0;
        }

        // Spawn obstacles
        state.obstacleTimer += deltaTime;
        if (state.obstacleTimer > 1500) {
          state.obstacleTimer = 0;
          const height = 40 + Math.random() * 60;
          state.obstacles.push({
            x: 800,
            y: 500 - height,
            width: 40,
            height: height,
          });
        }

        // Move obstacles
        state.obstacles.forEach((obs, idx) => {
          obs.x -= 5;
          if (obs.x < -50) {
            state.obstacles.splice(idx, 1);
            setScore(s => s + 10);
          }

          // Collision detection
          if (state.action !== 'shield') {
            const playerX = 100;
            const playerSize = 30;
            if (
              playerX + playerSize > obs.x &&
              playerX < obs.x + obs.width &&
              state.playerY + playerSize > obs.y &&
              state.playerY < obs.y + obs.height
            ) {
              setGameOver(true);
              if (score > highScore) setHighScore(score);
            }
          }
        });
      }

      // Render
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 500, canvas.width, 100);

      // Draw obstacles
      ctx.fillStyle = '#FF6347';
      state.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });

      // Draw player
      const playerX = 100;
      if (state.action === 'shield') {
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(playerX + 15, state.playerY + 15, 40, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = state.action === 'dash' ? '#FFD700' : '#4CAF50';
      ctx.fillRect(playerX, state.playerY, 30, 30);
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🦸', playerX + 15, state.playerY + 22);

      // UI
      ctx.fillStyle = '#000';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Tap: Jump | Hold: Dash | Long Hold: Shield', 10, 30);
      
      // Cooldown indicator
      if (state.actionCooldown > 0) {
        ctx.fillStyle = '#333';
        ctx.fillRect(10, 50, 200, 10);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(10, 50, 200 * (1 - state.actionCooldown / 1500), 10);
      }

      // Button press indicator
      if (state.buttonPressed) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.fillRect(canvas.width - 110, canvas.height - 110, 100, 100);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(state.buttonPressTime)}ms`, canvas.width - 60, canvas.height - 55);
      }

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
      title="One-Button Hero 🦸"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="mb-4 text-center">
          <p className="text-lg font-semibold">Press and hold SPACE for different actions!</p>
          <p className="text-sm text-gray-600">Tap: Jump | Hold: Dash | Long Hold: Shield</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-blue-400 rounded-lg shadow-lg bg-white"
        />
      </div>
    </GameLayout>
  );
}
