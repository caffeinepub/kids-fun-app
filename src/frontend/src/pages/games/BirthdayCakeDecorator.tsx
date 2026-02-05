import { useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { Button } from '@/components/ui/button';
import { ModulePage } from '../../App';

interface Decoration {
  id: number;
  type: string;
  x: number;
  y: number;
}

interface BirthdayCakeDecoratorProps {
  onNavigate: (page: ModulePage) => void;
}

export default function BirthdayCakeDecorator({ onNavigate }: BirthdayCakeDecoratorProps) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [selectedDecoration, setSelectedDecoration] = useState('🍓');
  const [nextId, setNextId] = useState(0);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setDecorations([]);
    setNextId(0);
  };

  const decorationOptions = [
    '🍓', '🍒', '🍫', '🍬', '🍭', '🌸', '⭐', '💝', '🎀', '🦄'
  ];

  const handleCakeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setDecorations(prev => [...prev, {
      id: nextId,
      type: selectedDecoration,
      x,
      y,
    }]);
    setNextId(id => id + 1);
    setScore(prev => prev + 5);
  };

  const finishDecorating = () => {
    const finalScore = score + decorations.length * 10;
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    setGameOver(true);
  };

  return (
    <GameLayout
      title="🎨 Birthday Cake Decorator"
      score={score}
      highScore={highScore}
      onRestart={startGame}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="p-8 bg-gradient-to-br from-yellow-200 to-pink-200 min-h-[600px]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Decorate Your Cake!</h2>
            <p className="text-lg">Click on the cake to add decorations</p>
          </div>

          {/* Decoration Selector */}
          <div className="bg-white p-4 rounded-lg border-4 border-purple-300">
            <h3 className="font-bold mb-3">Choose Decoration:</h3>
            <div className="flex flex-wrap gap-2">
              {decorationOptions.map(deco => (
                <Button
                  key={deco}
                  onClick={() => setSelectedDecoration(deco)}
                  variant={selectedDecoration === deco ? 'default' : 'outline'}
                  className="text-3xl w-16 h-16"
                >
                  {deco}
                </Button>
              ))}
            </div>
          </div>

          {/* Cake Canvas */}
          <div
            className="relative bg-gradient-to-b from-pink-300 to-pink-400 rounded-lg border-4 border-white shadow-2xl cursor-pointer"
            style={{ height: '400px' }}
            onClick={handleCakeClick}
          >
            {/* Cake layers */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-64 h-24 bg-pink-400 border-4 border-white rounded-lg" />
              <div className="w-80 h-24 bg-pink-400 border-4 border-white rounded-lg" />
            </div>

            {/* Decorations */}
            {decorations.map(deco => (
              <div
                key={deco.id}
                className="absolute text-3xl pointer-events-none"
                style={{
                  left: `${deco.x}%`,
                  top: `${deco.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {deco.type}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={finishDecorating} size="lg" className="flex-1 text-xl">
              Finish Decorating! 🎉
            </Button>
            <Button onClick={() => setDecorations([])} variant="outline" size="lg" className="flex-1 text-xl">
              Clear All
            </Button>
          </div>

          <div className="text-center text-lg font-semibold">
            Decorations Added: {decorations.length}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
