import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface GlitchWorldEscapeProps {
  onNavigate: (page: ModulePage) => void;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  glitched: boolean;
}

export default function GlitchWorldEscape({ onNavigate }: GlitchWorldEscapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const gameStateRef = useRef({
    playerX: 100,
    playerY: 400,
    playerVX: 0,
    playerVY: 0,
    platforms: [] as Platform[],
    glitchMode: false,
    glitchTimer: 0,
    keys: {} as Record<string, boolean>,
  });

  const initGame = () => {
    const platforms: Platform[] = [
      { x: 50, y: 500, width: 150, glitched: false },
      { x: 250, y: 400, width: 100, glitched: true },
      { x: 400, y: 350, width: 120, glitched: false },
      { x: 570, y: 300, width: 100, glitched: true },
      { x: 700, y: 200, width: 100, glitched: false },
    ];

    gameStateRef.current = {
      playerX: 100,
      playerY: 400,
      playerVX: 0,
      playerVY: 0,
      platforms,
      glitchMode: false,
      glitchTimer: 0,
      keys: {},
    };
    setScore(0);
    setLevel(1);
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
            state.playerX > plat.x &&
            state.playerX < plat.x + plat.width &&
            Math.abs(state.playerY + 20 - plat.y) < 10
          ) {
            onPlatform = true;
          }
        });
        if (onPlatform) {
          state.playerVY = -12;
        }
      }
      if (e.key === 'g' && !gameOver) {
        gameStateRef.current.glitchMode = !gameStateRef.current.glitchMode;
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
        const speed = 4;
        if (state.keys['ArrowLeft'] || state.keys['a']) state.playerVX = -speed;
        else if (state.keys['ArrowRight'] || state.keys['d']) state.playerVX = speed;
        else state.playerVX *= 0.8;

        // Gravity
        state.playerVY += 0.6;

        // Apply velocity
        state.playerX += state.playerVX;
        state.playerY += state.playerVY;

        // Platform collision
        state.platforms.forEach(plat => {
          // In glitch mode, glitched platforms become solid
          const isSolid = state.glitchMode ? plat.glitched : !plat.glitched;
          
          if (isSolid) {
            if (
              state.playerX > plat.x &&
              state.playerX < plat.x + plat.width &&
              state.playerY + 20 > plat.y &&
              state.playerY + 20 < plat.y + 20 &&
              state.playerVY > 0
            ) {
              state.playerY = plat.y - 20;
              state.playerVY = 0;
            }
          }
        });

        // Check if player fell
        if (state.playerY > 600) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }

        // Win condition
        if (state.playerX > 750 && state.playerY < 250) {
          setLevel(l => l + 1);
          setScore(s => s + 100);
          if (level >= 3) {
            setGameOver(true);
            if (score > highScore) setHighScore(score);
          } else {
            // Generate new level
            const newPlatforms: Platform[] = [];
            for (let i = 0; i < 6; i++) {
              newPlatforms.push({
                x: 50 + i * 130,
                y: 500 - i * 60,
                width: 80 + Math.random() * 60,
                glitched: Math.random() > 0.5,
              });
            }
            state.platforms = newPlatforms;
            state.playerX = 100;
            state.playerY = 400;
            state.playerVX = 0;
            state.playerVY = 0;
          }
        }
      }

      // Render with glitch effects
      if (state.glitchMode) {
        ctx.fillStyle = '#0f0f0f';
      } else {
        ctx.fillStyle = '#1a1a2e';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glitch effect
      if (state.glitchMode && Math.random() > 0.9) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 100, 100);
      }

      // Draw platforms
      state.platforms.forEach(plat => {
        const isSolid = state.glitchMode ? plat.glitched : !plat.glitched;
        
        if (isSolid) {
          ctx.fillStyle = plat.glitched ? '#00FF00' : '#4ECDC4';
          ctx.fillRect(plat.x, plat.y, plat.width, 20);
        } else {
          // Draw as transparent/glitched
          ctx.strokeStyle = plat.glitched ? '#00FF00' : '#4ECDC4';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(plat.x, plat.y, plat.width, 20);
          ctx.setLineDash([]);
        }
      });

      // Draw player
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(state.playerX - 15, state.playerY - 20, 30, 40);
      
      // Glitch player appearance
      if (state.glitchMode && Math.random() > 0.8) {
        ctx.fillStyle = `rgba(255, 0, 0, ${Math.random()})`;
        ctx.fillRect(state.playerX - 15 + Math.random() * 10 - 5, state.playerY - 20, 30, 40);
      }

      // UI
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Level: ${level}/3`, 10, 30);
      ctx.fillText(`Glitch Mode: ${state.glitchMode ? 'ON' : 'OFF'}`, 10, 60);
      ctx.fillText('Press G to toggle glitch', 10, 90);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore, level]);

  return (
    <GameLayout
      title="Glitch World Escape 🌐"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-black to-green-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Arrow keys or WASD to move • W/Up to jump • G to glitch</p>
          <p className="text-sm">Use glitches to make invisible platforms solid!</p>
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
