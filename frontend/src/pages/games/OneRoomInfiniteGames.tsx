import { useEffect, useRef, useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { ModulePage } from '../../App';

interface OneRoomInfiniteGamesProps {
  onNavigate: (page: ModulePage) => void;
}

export default function OneRoomInfiniteGames({ onNavigate }: OneRoomInfiniteGamesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentGame, setCurrentGame] = useState(0);
  
  const gameStateRef = useRef({
    player: { x: 400, y: 300 },
    gameMode: 0,
    // Dodge game
    projectiles: [] as { x: number; y: number; vx: number; vy: number }[],
    // Collect game
    coins: [] as { x: number; y: number; collected: boolean }[],
    // Memory game
    memorySequence: [] as number[],
    memoryInput: [] as number[],
    showingSequence: false,
    sequenceIndex: 0,
    // Platformer
    platforms: [] as { x: number; y: number; width: number }[],
    playerVY: 0,
    onGround: false,
    keys: {} as Record<string, boolean>,
    gameTimer: 0,
    gameDuration: 10000,
  });

  const initGame = () => {
    const state = gameStateRef.current;
    state.player = { x: 400, y: 300 };
    state.gameMode = 0;
    state.projectiles = [];
    state.coins = [];
    state.memorySequence = [];
    state.memoryInput = [];
    state.platforms = [];
    state.playerVY = 0;
    state.onGround = false;
    state.gameTimer = 0;
    
    setCurrentGame(0);
    setScore(0);
    setGameOver(false);
    
    startNewMiniGame();
  };

  const startNewMiniGame = () => {
    const state = gameStateRef.current;
    state.gameMode = Math.floor(Math.random() * 4);
    state.gameTimer = 0;
    state.player = { x: 400, y: 300 };
    
    setCurrentGame(state.gameMode);
    
    // Initialize based on game mode
    if (state.gameMode === 0) {
      // Dodge game
      state.projectiles = [];
      for (let i = 0; i < 5; i++) {
        state.projectiles.push({
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
        });
      }
    } else if (state.gameMode === 1) {
      // Collect game
      state.coins = [];
      for (let i = 0; i < 10; i++) {
        state.coins.push({
          x: 100 + Math.random() * 600,
          y: 100 + Math.random() * 400,
          collected: false,
        });
      }
    } else if (state.gameMode === 2) {
      // Memory game
      state.memorySequence = [];
      for (let i = 0; i < 4; i++) {
        state.memorySequence.push(Math.floor(Math.random() * 4));
      }
      state.memoryInput = [];
      state.showingSequence = true;
      state.sequenceIndex = 0;
    } else if (state.gameMode === 3) {
      // Platformer
      state.platforms = [
        { x: 0, y: 550, width: 200 },
        { x: 250, y: 450, width: 150 },
        { x: 450, y: 350, width: 150 },
        { x: 650, y: 250, width: 150 },
      ];
      state.player.y = 500;
      state.playerVY = 0;
      state.onGround = false;
    }
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
      
      // Memory game input
      if (state.gameMode === 2 && !state.showingSequence) {
        if (e.key >= '1' && e.key <= '4') {
          const num = parseInt(e.key) - 1;
          state.memoryInput.push(num);
          
          if (state.memoryInput.length === state.memorySequence.length) {
            const correct = state.memoryInput.every((val, idx) => val === state.memorySequence[idx]);
            if (correct) {
              setScore(s => s + 20);
              startNewMiniGame();
            } else {
              setGameOver(true);
              if (score > highScore) setHighScore(score);
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

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (!gameOver) {
        state.gameTimer += 16;
        
        // Switch game after duration
        if (state.gameTimer > state.gameDuration) {
          setScore(s => s + 10);
          startNewMiniGame();
        }

        // Game mode 0: Dodge
        if (state.gameMode === 0) {
          const speed = 4;
          if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= speed;
          if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += speed;
          if (state.keys['ArrowUp'] || state.keys['w']) state.player.y -= speed;
          if (state.keys['ArrowDown'] || state.keys['s']) state.player.y += speed;

          state.player.x = Math.max(20, Math.min(780, state.player.x));
          state.player.y = Math.max(20, Math.min(580, state.player.y));

          state.projectiles.forEach(proj => {
            proj.x += proj.vx;
            proj.y += proj.vy;
            if (proj.x < 0 || proj.x > 800) proj.vx *= -1;
            if (proj.y < 0 || proj.y > 600) proj.vy *= -1;

            const dx = proj.x - state.player.x;
            const dy = proj.y - state.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 35) {
              setGameOver(true);
              if (score > highScore) setHighScore(score);
            }
          });
        }
        
        // Game mode 1: Collect
        else if (state.gameMode === 1) {
          const speed = 4;
          if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= speed;
          if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += speed;
          if (state.keys['ArrowUp'] || state.keys['w']) state.player.y -= speed;
          if (state.keys['ArrowDown'] || state.keys['s']) state.player.y += speed;

          state.player.x = Math.max(20, Math.min(780, state.player.x));
          state.player.y = Math.max(20, Math.min(580, state.player.y));

          state.coins.forEach(coin => {
            if (!coin.collected) {
              const dx = coin.x - state.player.x;
              const dy = coin.y - state.player.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 30) {
                coin.collected = true;
                setScore(s => s + 5);
              }
            }
          });

          if (state.coins.every(c => c.collected)) {
            startNewMiniGame();
          }
        }
        
        // Game mode 2: Memory
        else if (state.gameMode === 2) {
          if (state.showingSequence) {
            if (state.gameTimer % 800 === 0) {
              state.sequenceIndex++;
              if (state.sequenceIndex >= state.memorySequence.length) {
                state.showingSequence = false;
              }
            }
          }
        }
        
        // Game mode 3: Platformer
        else if (state.gameMode === 3) {
          const speed = 4;
          if (state.keys['ArrowLeft'] || state.keys['a']) state.player.x -= speed;
          if (state.keys['ArrowRight'] || state.keys['d']) state.player.x += speed;

          if ((state.keys['ArrowUp'] || state.keys['w'] || state.keys[' ']) && state.onGround) {
            state.playerVY = -12;
            state.onGround = false;
          }

          state.playerVY += 0.5;
          state.player.y += state.playerVY;

          state.player.x = Math.max(20, Math.min(780, state.player.x));

          state.onGround = false;
          state.platforms.forEach(platform => {
            if (
              state.player.x + 15 > platform.x &&
              state.player.x - 15 < platform.x + platform.width &&
              state.player.y + 15 > platform.y &&
              state.player.y + 15 < platform.y + 20 &&
              state.playerVY > 0
            ) {
              state.player.y = platform.y - 15;
              state.playerVY = 0;
              state.onGround = true;
            }
          });

          if (state.player.y > 650) {
            setGameOver(true);
            if (score > highScore) setHighScore(score);
          }

          if (state.player.y < 100) {
            startNewMiniGame();
          }
        }
      }

      // Render
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render based on game mode
      if (state.gameMode === 0) {
        // Dodge game
        state.projectiles.forEach(proj => {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 20, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (state.gameMode === 1) {
        // Collect game
        state.coins.forEach(coin => {
          if (!coin.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, 15, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      } else if (state.gameMode === 2) {
        // Memory game
        const colors = ['#ef4444', '#3b82f6', '#22c55e', '#fbbf24'];
        const positions = [
          { x: 200, y: 200 },
          { x: 600, y: 200 },
          { x: 200, y: 400 },
          { x: 600, y: 400 },
        ];

        positions.forEach((pos, idx) => {
          const isActive = state.showingSequence && 
                          state.sequenceIndex < state.memorySequence.length &&
                          state.memorySequence[state.sequenceIndex] === idx;
          
          ctx.fillStyle = isActive ? colors[idx] : '#1e293b';
          ctx.fillRect(pos.x - 50, pos.y - 50, 100, 100);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.strokeRect(pos.x - 50, pos.y - 50, 100, 100);
          
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText((idx + 1).toString(), pos.x, pos.y + 10);
        });
      } else if (state.gameMode === 3) {
        // Platformer
        state.platforms.forEach(platform => {
          ctx.fillStyle = '#6366f1';
          ctx.fillRect(platform.x, platform.y, platform.width, 20);
        });
      }

      // Player (except in memory game)
      if (state.gameMode !== 2) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // UI
      const gameNames = ['Dodge!', 'Collect!', 'Memory!', 'Platform!'];
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 300, 100);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Game: ${gameNames[state.gameMode]}`, 20, 40);
      ctx.font = '14px Arial';
      ctx.fillText(`Time: ${((state.gameDuration - state.gameTimer) / 1000).toFixed(1)}s`, 20, 65);
      
      if (state.gameMode === 2) {
        ctx.fillText(state.showingSequence ? 'Watch!' : 'Repeat! (Press 1-4)', 20, 90);
      }

      // Timer bar
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(20, 95, 280, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(20, 95, (1 - state.gameTimer / state.gameDuration) * 280, 10);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, score, highScore, currentGame]);

  return (
    <GameLayout
      title="One Room, Infinite Games 🎲"
      score={score}
      highScore={highScore}
      onRestart={handleRestart}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="mb-4 text-center text-white">
          <p className="text-lg font-semibold">Random minigames every 10 seconds!</p>
          <p className="text-sm">Arrow keys/WASD • Follow instructions • Adapt quickly!</p>
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
