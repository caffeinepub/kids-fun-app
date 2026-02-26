import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Clock, Target } from 'lucide-react';

type GameType = 'puzzle' | 'educational' | 'creative' | 'action' | 'logic';

interface Game {
  id: string;
  name: string;
  type: GameType;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  icon: string;
  progress: number;
  highScore: number;
}

export default function GamesModule() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const games: Game[] = [
    {
      id: '1',
      name: 'Puzzle Master',
      type: 'puzzle',
      difficulty: 'easy',
      description: 'Solve colorful jigsaw puzzles!',
      icon: '/assets/generated/puzzle-game-icon.dim_64x64.png',
      progress: 65,
      highScore: 1250,
    },
    {
      id: '2',
      name: 'Math Adventure',
      type: 'educational',
      difficulty: 'medium',
      description: 'Learn math while having fun!',
      icon: '/assets/generated/educational-game-icon.dim_64x64.png',
      progress: 40,
      highScore: 890,
    },
    {
      id: '3',
      name: 'Art Studio',
      type: 'creative',
      difficulty: 'easy',
      description: 'Create beautiful digital art!',
      icon: '/assets/generated/creative-game-icon.dim_64x64.png',
      progress: 80,
      highScore: 2100,
    },
    {
      id: '4',
      name: 'Space Runner',
      type: 'action',
      difficulty: 'hard',
      description: 'Race through space obstacles!',
      icon: '/assets/generated/action-game-icon.dim_64x64.png',
      progress: 25,
      highScore: 560,
    },
    {
      id: '5',
      name: 'Logic Quest',
      type: 'logic',
      difficulty: 'medium',
      description: 'Solve challenging logic puzzles!',
      icon: '/assets/generated/logic-game-icon.dim_64x64.png',
      progress: 50,
      highScore: 1450,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const gamesByType = (type: GameType) => games.filter((g) => g.type === type);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Games 🎮
        </h1>
        <p className="text-lg text-gray-700">Choose a game and start playing!</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="all" className="text-sm md:text-base">All Games</TabsTrigger>
          <TabsTrigger value="puzzle" className="text-sm md:text-base">Puzzle</TabsTrigger>
          <TabsTrigger value="educational" className="text-sm md:text-base">Educational</TabsTrigger>
          <TabsTrigger value="creative" className="text-sm md:text-base">Creative</TabsTrigger>
          <TabsTrigger value="action" className="text-sm md:text-base">Action</TabsTrigger>
          <TabsTrigger value="logic" className="text-sm md:text-base">Logic</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} onSelect={setSelectedGame} />
            ))}
          </div>
        </TabsContent>

        {(['puzzle', 'educational', 'creative', 'action', 'logic'] as GameType[]).map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gamesByType(type).map((game) => (
                <GameCard key={game.id} game={game} onSelect={setSelectedGame} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedGame && (
        <Card className="border-4 border-primary shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{selectedGame.name}</CardTitle>
              <Badge className={getDifficultyColor(selectedGame.difficulty)}>
                {selectedGame.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-lg">{selectedGame.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">High Score: {selectedGame.highScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">Progress: {selectedGame.progress}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Game Progress</span>
                <span>{selectedGame.progress}%</span>
              </div>
              <Progress value={selectedGame.progress} className="h-3" />
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 text-lg h-12 font-bold">
                Play Now! 🎮
              </Button>
              <Button variant="outline" className="flex-1 text-lg h-12">
                View Stats
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function GameCard({ game, onSelect }: { game: Game; onSelect: (game: Game) => void }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:scale-105">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <img src={game.icon} alt={game.name} className="w-12 h-12" />
          <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
        </div>
        <CardTitle className="text-xl">{game.name}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{game.progress}%</span>
          </div>
          <Progress value={game.progress} className="h-2" />
        </div>
        <Button onClick={() => onSelect(game)} className="w-full font-semibold">
          Play
        </Button>
      </CardContent>
    </Card>
  );
}
