import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ghost, Skull, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { ModulePage } from '../App';

interface ScaryGame {
  id: ModulePage;
  name: string;
  description: string;
  icon: string;
  difficulty: string;
  theme: string;
}

const scaryGames: ScaryGame[] = [
  {
    id: 'game:monster-maze',
    name: 'Monster Maze 👹',
    description: 'Navigate through a maze full of goofy monsters and reach the exit!',
    icon: '🏰',
    difficulty: 'Medium',
    theme: 'purple',
  },
  {
    id: 'game:spider-web-puzzle',
    name: 'Spider Web Puzzle 🕷️',
    description: 'Untangle webs to free trapped monster friends!',
    icon: '🕸️',
    difficulty: 'Easy',
    theme: 'green',
  },
  {
    id: 'game:pumpkin-smash',
    name: 'Pumpkin Smash 🎃',
    description: 'Whack bouncing pumpkins for points before time runs out!',
    icon: '🎃',
    difficulty: 'Easy',
    theme: 'orange',
  },
];

interface ScaryHubProps {
  onNavigate: (page: ModulePage) => void;
}

export default function ScaryHub({ onNavigate }: ScaryHubProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [surpriseTriggered, setSurpriseTriggered] = useState(false);

  const triggerSurprise = () => {
    setSurpriseTriggered(true);
    setTimeout(() => setSurpriseTriggered(false), 2000);
  };

  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      purple: 'from-purple-600 to-purple-800',
      green: 'from-green-600 to-green-800',
      orange: 'from-orange-600 to-orange-800',
      red: 'from-red-600 to-red-800',
      blue: 'from-blue-600 to-blue-800',
    };
    return colors[theme] || 'from-purple-600 to-purple-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 p-4 md:p-8 relative overflow-hidden">
      {/* Spooky Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-30">👻</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse opacity-20">🦇</div>
        <div className="absolute bottom-20 left-1/4 text-7xl animate-spin-slow opacity-25">🕷️</div>
        <div className="absolute bottom-10 right-1/3 text-6xl animate-bounce opacity-30">🎃</div>
      </div>

      {/* Surprise Pop-up */}
      {surpriseTriggered && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-9xl animate-bounce">
            {['👻', '🧟', '🧛', '🎃', '💀'][Math.floor(Math.random() * 5)]}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 animate-pulse">
            <Ghost className="w-12 h-12 text-neon-purple" />
            <h1 className="text-5xl md:text-7xl font-bold text-neon-orange text-shadow-neon-lg">
              Scary Hub 👻
            </h1>
            <Skull className="w-12 h-12 text-neon-green" />
          </div>
          <p className="text-2xl md:text-3xl text-neon-cyan text-shadow-neon-md">
            Spooky fun games with silly monsters!
          </p>

          {/* Sound Toggle */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="border-4 border-neon-purple bg-black/50 hover:bg-neon-purple/20 text-neon-purple"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Sound On
                </>
              ) : (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Sound Off
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={triggerSurprise}
              className="border-4 border-neon-orange bg-black/50 hover:bg-neon-orange/20 text-neon-orange"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Surprise Me!
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scaryGames.map((game, index) => (
            <Card
              key={game.id}
              className="border-4 border-neon-purple hover:border-neon-orange hover:shadow-neon-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-sm group"
              onClick={() => onNavigate(game.id)}
              onMouseEnter={() => {
                if (Math.random() > 0.7) triggerSurprise();
              }}
            >
              <CardHeader className="pb-3">
                <div className="relative">
                  <div className="w-full h-40 flex items-center justify-center text-8xl bg-gradient-to-br from-purple-800/50 to-black/50 rounded-lg border-4 border-neon-green group-hover:animate-pulse">
                    {game.icon}
                  </div>
                  <Badge className={`absolute top-2 right-2 text-xs font-bold bg-gradient-to-r ${getThemeColor(game.theme)} border-2 border-white`}>
                    {game.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardTitle className="text-xl text-neon-cyan text-shadow-neon-md">
                  {game.name}
                </CardTitle>
                <CardDescription className="text-base text-neon-green text-shadow-neon-sm">
                  {game.description}
                </CardDescription>

                <Button className="w-full text-lg font-bold h-12 bg-gradient-to-r from-neon-purple to-neon-orange hover:from-neon-orange hover:to-neon-purple border-2 border-neon-cyan">
                  Play Now! 👻
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fun Stats Section */}
        <Card className="border-4 border-neon-orange bg-gradient-to-r from-black/80 to-orange-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2 text-neon-orange text-shadow-neon-lg">
              <Ghost className="w-10 h-10" />
              Your Spooky Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-5xl font-bold text-neon-purple text-shadow-neon-md">3</div>
                <div className="text-neon-cyan text-shadow-neon-sm">Scary Games</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-neon-green text-shadow-neon-md">0</div>
                <div className="text-neon-cyan text-shadow-neon-sm">Monsters Met</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-neon-orange text-shadow-neon-md">0</div>
                <div className="text-neon-cyan text-shadow-neon-sm">Pumpkins Smashed</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-neon-pink text-shadow-neon-md">0</div>
                <div className="text-neon-cyan text-shadow-neon-sm">Potions Mixed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun Message */}
        <div className="text-center">
          <p className="text-xl text-neon-green text-shadow-neon-md animate-pulse">
            🎃 Don't worry, these monsters are friendly and silly! 🎃
          </p>
        </div>
      </div>
    </div>
  );
}
