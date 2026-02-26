import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface CityMovingPlatformsProps {
  onNavigate: (page: ModulePage) => void;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  rotation: number;
  rotationSpeed: number;
}

export default function CityMovingPlatforms({ onNavigate }: CityMovingPlatformsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    playerX: 100,
    playerY: 400,
    playerVX: 0,
    playerVY: 0,
    platforms: [] as Platform[],
    worldRotation: 0,
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const platforms: Platform[] = [];
    for (let i = 0; i < 8; i++) {
      platforms.push({
        x: 100 + i * 120,
        y: 200 + Math.sin(i) * 100,
        width: 100,
        rotation: 0,
        rotationSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    gameStateRef.current = {
      playerX: 100,
      playerY: 400,
      playerVX: 0,
      playerVY: 0,
      platforms,
      worldRotation: 0,
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
      if ((e.key === 'ArrowUp' || e.key === 'w') && !gameOver) {
        const state = gameStateRef.current;
        // Check if on platform
        let onPlatform = false;
        state.platforms.forEach(plat => {
          if (
            state.playerX > plat.x - plat.width / 2 &&
            state.playerX < plat.x + plat.width / 2 &&
            Math.abs(state.playerY - plat.y) < 30
          ) {
            onPlatform = true;
          }
        });
        if (onPlatform) {
          state.playerVY = -10;
        }
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
        const speed = 3;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.playerVX = -speed;
        else if (state.keys['ArrowRight'] || state.keys['d']) state.playerVX = speed;
        else state.playerVX *= 0.8;

        // Gravity
        state.playerVY += 0.5;

        // Apply velocity
        state.playerX += state.playerVX;
        state.playerY += state.playerVY;

        // Rotate world
        state.worldRotation += 0.005;

        // Rotate platforms
        state.platforms.forEach(plat => {
          plat.rotation += plat.rotationSpeed;
          plat.y += Math.sin(plat.rotation) * 0.5;
        });

        // Platform collision
        state.platforms.forEach(plat => {
          if (
            state.playerX > plat.x - plat.width / 2 &&
            state.playerX < plat.x + plat.width / 2 &&
            state.playerY + 20 > plat.y - 10 &&
            state.playerY + 20 < plat.y + 10 &&
            state.playerVY > 0
          ) {
            state.playerY = plat.y - 20;
            state.playerVY = 0;
          }
        });

        // Check if player fell
        if (state.playerY > 600) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }

        // Score for distance
        if (state.playerX > score * 10) {
          setScore(Math.floor(state.playerX / 10));
        }

        // Win condition
        if (state.playerX > 900) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      // Render
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(state.worldRotation);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 3, canvas.height * 3);

      // Draw platforms
      state.platforms.forEach(plat => {
        ctx.save();
        ctx.translate(plat.x, plat.y);
        ctx.rotate(plat.rotation);
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(-plat.width / 2, -10, plat.width, 20);
        ctx.restore();
      });

      // Draw player
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(state.playerX - 15, state.playerY - 20, 30, 40);
      ctx.fillStyle = '#fff';
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏃', state.playerX, state.playerY);

      ctx.restore();

      // UI (not rotated)
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Distance: ${Math.floor(state.playerX)}`, 10, 30);

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
      title="City Built on Moving Platforms 🏙️"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Arrow keys or WASD to move • W/Up to jump</p>
          <p className="text-sm">Navigate the constantly shifting city!</p>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-indigo-400 rounded-lg shadow-lg"
        />
      </div>
    </GameLayout>
  );
}
