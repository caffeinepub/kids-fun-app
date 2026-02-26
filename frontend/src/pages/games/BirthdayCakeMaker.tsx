import { useState } from 'react';
import GameLayout from '../../components/GameLayout';
import { Button } from '@/components/ui/button';
import { ModulePage } from '../../App';

interface BirthdayCakeMakerProps {
  onNavigate: (page: ModulePage) => void;
}

export default function BirthdayCakeMaker({ onNavigate }: BirthdayCakeMakerProps) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [step, setStep] = useState(0);
  const [cakeBase, setCakeBase] = useState('');
  const [cakeFlavor, setCakeFlavor] = useState('');
  const [cakeLayers, setCakeLayers] = useState(1);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setStep(0);
    setCakeBase('');
    setCakeFlavor('');
    setCakeLayers(1);
  };

  const bases = [
    { id: 'round', name: 'Round', emoji: '⭕', points: 10 },
    { id: 'square', name: 'Square', emoji: '⬜', points: 10 },
    { id: 'heart', name: 'Heart', emoji: '❤️', points: 15 },
  ];

  const flavors = [
    { id: 'chocolate', name: 'Chocolate', color: '#8B4513', points: 10 },
    { id: 'vanilla', name: 'Vanilla', color: '#FFF8DC', points: 10 },
    { id: 'strawberry', name: 'Strawberry', color: '#FFB6C1', points: 10 },
    { id: 'lemon', name: 'Lemon', color: '#FFFACD', points: 10 },
  ];

  const selectBase = (base: string, points: number) => {
    setCakeBase(base);
    setScore(prev => prev + points);
    setStep(1);
  };

  const selectFlavor = (flavor: string, points: number) => {
    setCakeFlavor(flavor);
    setScore(prev => prev + points);
    setStep(2);
  };

  const selectLayers = (layers: number) => {
    setCakeLayers(layers);
    setScore(prev => prev + layers * 10);
    setStep(3);
  };

  const finishCake = () => {
    const finalScore = score + 50;
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    setGameOver(true);
  };

  const selectedFlavor = flavors.find(f => f.id === cakeFlavor);

  return (
    <GameLayout
      title="🎂 Birthday Cake Maker"
      score={score}
      highScore={highScore}
      onRestart={startGame}
      onNavigate={onNavigate}
      gameOver={gameOver}
    >
      <div className="p-8 bg-gradient-to-br from-pink-200 to-purple-200 min-h-[600px]">
        <div className="max-w-4xl mx-auto">
          {step === 0 && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Choose Your Cake Base</h2>
              <div className="grid grid-cols-3 gap-4">
                {bases.map(base => (
                  <Button
                    key={base.id}
                    onClick={() => selectBase(base.id, base.points)}
                    className="h-32 text-6xl flex flex-col gap-2"
                    variant="outline"
                  >
                    <span>{base.emoji}</span>
                    <span className="text-lg">{base.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Choose Your Flavor</h2>
              <div className="grid grid-cols-2 gap-4">
                {flavors.map(flavor => (
                  <Button
                    key={flavor.id}
                    onClick={() => selectFlavor(flavor.id, flavor.points)}
                    className="h-32 text-2xl"
                    style={{ backgroundColor: flavor.color }}
                  >
                    {flavor.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">How Many Layers?</h2>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(layers => (
                  <Button
                    key={layers}
                    onClick={() => selectLayers(layers)}
                    className="h-32 text-6xl"
                    variant="outline"
                  >
                    {layers}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold mb-6">Your Amazing Cake!</h2>
              <div className="flex flex-col items-center gap-2">
                {[...Array(cakeLayers)].map((_, i) => (
                  <div
                    key={i}
                    className="border-4 border-white rounded-lg shadow-lg"
                    style={{
                      width: `${200 - i * 40}px`,
                      height: '80px',
                      backgroundColor: selectedFlavor?.color,
                    }}
                  />
                ))}
                <div className="text-6xl mt-4">🕯️</div>
              </div>
              <Button onClick={finishCake} size="lg" className="text-xl">
                Finish Cake! 🎉
              </Button>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
