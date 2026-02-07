import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Volume2, VolumeX } from 'lucide-react';
import { ModulePage } from '../App';

interface GameInfo {
  id: ModulePage;
  name: string;
  description: string;
  category: string;
  icon: string;
  difficulty: string[];
}

const games: GameInfo[] = [
  {
    id: 'game:balloon-pop',
    name: 'Balloon Pop',
    description: 'Pop colorful balloons before time runs out!',
    category: 'Arcade',
    icon: '/assets/generated/balloon-pop-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:super-speedy-racer',
    name: 'Super Speedy Racer',
    description: 'Race through lanes and dodge obstacles!',
    category: 'Racing',
    icon: '/assets/generated/super-speedy-racer-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:ambulance-rescue',
    name: 'Ambulance Rescue',
    description: 'Save patients by driving carefully!',
    category: 'Action',
    icon: '/assets/generated/ambulance-rescue-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:eclipse-now-solo',
    name: 'Eclipse Now Solo',
    description: 'Survive in space and collect energy!',
    category: 'Adventure',
    icon: '/assets/generated/eclipse-now-solo-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:forest-night',
    name: 'Forest Night',
    description: 'Find your way through the dark forest!',
    category: 'Adventure',
    icon: '/assets/generated/forest-night-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:memory-match',
    name: 'Memory Match',
    description: 'Match pairs of cards to win!',
    category: 'Puzzle',
    icon: '/assets/generated/memory-match-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:birthday-cake-maker',
    name: 'Birthday Cake Maker',
    description: 'Bake the perfect birthday cake!',
    category: 'Creative',
    icon: '/assets/generated/birthday-cake-maker-game.dim_200x200.png',
    difficulty: ['Easy'],
  },
  {
    id: 'game:birthday-cake-decorator',
    name: 'Birthday Cake Decorator',
    description: 'Decorate cakes with frosting and toppings!',
    category: 'Creative',
    icon: '/assets/generated/birthday-cake-decorator-game.dim_200x200.png',
    difficulty: ['Easy'],
  },
  {
    id: 'game:famous-places',
    name: 'Find Famous Places',
    description: 'Identify world landmarks in this quiz!',
    category: 'Educational',
    icon: '/assets/generated/famous-places-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:word-wizard',
    name: 'Word Wizard',
    description: 'Form words from letters to score points!',
    category: 'Educational',
    icon: '/assets/generated/word-wizard-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:police-buddy-chase',
    name: 'Police Buddy Chase',
    description: 'Chase criminals and avoid obstacles!',
    category: 'Action',
    icon: '/assets/generated/police-buddy-chase-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:number-runner',
    name: 'Number Runner',
    description: 'Solve math problems while running!',
    category: 'Educational',
    icon: '/assets/generated/number-runner-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:bibble-adventure',
    name: 'Bibble Adventure',
    description: 'Help Bibble collect coins in this platformer!',
    category: 'Platform',
    icon: '/assets/generated/bibble-adventure-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:shape-shifting-world',
    name: 'Shape-Shifting World',
    description: 'Transform into animals to solve puzzles!',
    category: 'Adventure',
    icon: '/assets/generated/shape-shifting-world-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:time-control-adventure',
    name: 'Time-Control Adventure',
    description: 'Manipulate time to overcome challenges!',
    category: 'Adventure',
    icon: '/assets/generated/time-control-adventure-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:theme-park-builder',
    name: 'Theme Park Builder',
    description: 'Build and manage your dream theme park!',
    category: 'Simulation',
    icon: '/assets/generated/theme-park-builder-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium'],
  },
  {
    id: 'game:mind-maze-puzzle',
    name: 'Mind Maze Puzzle',
    description: 'Solve puzzles in a surreal maze world!',
    category: 'Puzzle',
    icon: '/assets/generated/mind-maze-puzzle-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:space-station-life',
    name: 'Space Station Life',
    description: 'Live and work on a space station!',
    category: 'Simulation',
    icon: '/assets/generated/space-station-life-game.dim_200x200.png',
    difficulty: ['Medium'],
  },
  {
    id: 'game:superpower-training',
    name: 'Superpower Training',
    description: 'Train and unlock amazing superpowers!',
    category: 'Action',
    icon: '/assets/generated/superpower-training-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:escape-room-universe',
    name: 'Escape Room Universe',
    description: 'Escape from themed puzzle rooms!',
    category: 'Puzzle',
    icon: '/assets/generated/escape-room-universe-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:gadget-combat',
    name: 'Gadget Combat',
    description: 'Use creative gadgets to capture enemies!',
    category: 'Action',
    icon: '/assets/generated/gadget-combat-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:grandma-secret-arcade',
    name: "Grandma's Secret Arcade",
    description: 'Play retro minigames with Grandma!',
    category: 'Arcade',
    icon: '/assets/generated/grandma-secret-arcade-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium'],
  },
  {
    id: 'game:screen-is-enemy',
    name: 'Screen Is Enemy',
    description: 'The screen attacks you - adapt and survive!',
    category: 'Action',
    icon: '/assets/generated/screen-is-enemy-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:control-enemies',
    name: 'Control Enemies',
    description: 'Control enemies to guide your character!',
    category: 'Puzzle',
    icon: '/assets/generated/control-enemies-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:everything-breaks',
    name: 'Everything Breaks',
    description: 'Platforms crumble - plan your moves!',
    category: 'Platform',
    icon: '/assets/generated/everything-breaks-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:sound-based-world',
    name: 'Sound Based World',
    description: 'Use sound waves to reveal the world!',
    category: 'Adventure',
    icon: '/assets/generated/sound-based-world-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:reverse-progression',
    name: 'Reverse Progression',
    description: 'Start powerful, lose abilities each level!',
    category: 'Platform',
    icon: '/assets/generated/reverse-progression-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:enemies-platforms',
    name: 'Enemies Platforms',
    description: 'Jump on enemies to use them as platforms!',
    category: 'Platform',
    icon: '/assets/generated/enemies-platforms-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:pause-mechanic',
    name: 'Pause Mechanic',
    description: 'Pausing changes the game - use it wisely!',
    category: 'Puzzle',
    icon: '/assets/generated/pause-mechanic-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:youre-late-always',
    name: "You're Late Always",
    description: 'Start mid-chaos and survive the madness!',
    category: 'Action',
    icon: '/assets/generated/youre-late-always-game.dim_200x200.png',
    difficulty: ['Hard'],
  },
  {
    id: 'game:lies-and-truths',
    name: 'Lies And Truths',
    description: 'The narrator lies - test everything!',
    category: 'Puzzle',
    icon: '/assets/generated/lies-and-truths-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:tiny-hero-giant-world',
    name: 'Tiny Hero Giant World',
    description: 'Explore a giant world as a tiny hero!',
    category: 'Adventure',
    icon: '/assets/generated/tiny-hero-giant-world-game.dim_200x200.png',
    difficulty: ['Medium'],
  },
  {
    id: 'game:tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic strategy game - Player vs Player or AI!',
    category: 'Puzzle',
    icon: '/assets/generated/tic-tac-toe-icon-transparent.dim_64x64.png',
    difficulty: ['Easy', 'Medium'],
  },
  {
    id: 'game:cronker-kontry',
    name: 'Cronker Kontry',
    description: 'Build your empire in this idle-clicker adventure!',
    category: 'Simulation',
    icon: '/assets/generated/theme-park-builder-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium'],
  },
  {
    id: 'game:pac-man',
    name: 'Pac-Man',
    description: 'Eat pellets and avoid ghosts in this classic maze game!',
    category: 'Arcade',
    icon: '/assets/generated/balloon-pop-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:tetris',
    name: 'Tetris',
    description: 'Stack falling blocks and clear lines to score!',
    category: 'Puzzle',
    icon: '/assets/generated/mind-maze-puzzle-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:space-invaders',
    name: 'Space Invaders',
    description: 'Defend Earth from waves of alien invaders!',
    category: 'Action',
    icon: '/assets/generated/eclipse-now-solo-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium', 'Hard'],
  },
  {
    id: 'game:floor-is-liar',
    name: 'The Floor Is a Liar',
    description: 'Platforms hide their true behavior - observe and survive!',
    category: 'Puzzle',
    icon: '/assets/generated/floor-is-liar-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:inventory-is-enemy',
    name: 'Inventory Is the Enemy',
    description: 'Your items trigger randomly - manage the chaos!',
    category: 'Puzzle',
    icon: '/assets/generated/inventory-is-enemy-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:speed-is-health',
    name: 'Speed Is Health',
    description: 'Keep moving or lose health - never stop!',
    category: 'Action',
    icon: '/assets/generated/speed-is-health-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:enemy-controls-camera',
    name: 'Enemy Controls the Camera',
    description: 'Enemies manipulate your view - adapt to survive!',
    category: 'Platform',
    icon: '/assets/generated/enemy-controls-camera-game.dim_200x200.png',
    difficulty: ['Hard'],
  },
  {
    id: 'game:one-room-infinite-games',
    name: 'One Room, Infinite Games',
    description: 'The room changes genre every minute!',
    category: 'Action',
    icon: '/assets/generated/one-room-infinite-games.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
  {
    id: 'game:move-when-blink',
    name: 'You Can Only Move When You Blink',
    description: 'Time moves only when you blink - precise timing required!',
    category: 'Puzzle',
    icon: '/assets/generated/move-when-blink-game.dim_200x200.png',
    difficulty: ['Hard'],
  },
  {
    id: 'game:bosses-learn-habits',
    name: 'Bosses Learn Your Habits',
    description: 'Bosses adapt to your playstyle - stay unpredictable!',
    category: 'Action',
    icon: '/assets/generated/bosses-learn-habits-game.dim_200x200.png',
    difficulty: ['Hard'],
  },
  {
    id: 'game:everything-is-button',
    name: 'Everything Is a Button',
    description: 'Every object is interactive - press everything!',
    category: 'Puzzle',
    icon: '/assets/generated/everything-is-button-game.dim_200x200.png',
    difficulty: ['Easy', 'Medium'],
  },
  {
    id: 'game:delayed-controls',
    name: 'Delayed Controls',
    description: 'Your inputs execute 2 seconds late - plan ahead!',
    category: 'Action',
    icon: '/assets/generated/delayed-controls-game.dim_200x200.png',
    difficulty: ['Hard'],
  },
  {
    id: 'game:tutorial-is-villain',
    name: 'The Tutorial Is the Villain',
    description: 'The tutorial lies and tricks you - outsmart it!',
    category: 'Platform',
    icon: '/assets/generated/tutorial-is-villain-game.dim_200x200.png',
    difficulty: ['Medium', 'Hard'],
  },
];

interface GamesHubProps {
  onNavigate: (page: ModulePage) => void;
}

export default function GamesHub({ onNavigate }: GamesHubProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(games.map(g => g.category)))];

  const filteredGames = selectedCategory === 'All' 
    ? games 
    : games.filter(g => g.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Gamepad2 className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Games Hub 🎮
            </h1>
          </div>
          <p className="text-xl text-gray-700">Choose a game and start playing!</p>
          
          {/* Sound Toggle */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="border-4"
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
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedCategory(category)}
              className="border-3 font-bold"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <Card
              key={game.id}
              className="border-4 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
              onClick={() => onNavigate(game.id)}
            >
              <CardHeader className="pb-3">
                <div className="relative">
                  <img
                    src={game.icon}
                    alt={game.name}
                    className="w-full h-40 object-cover rounded-lg border-4 border-purple-200"
                  />
                  <Badge className="absolute top-2 right-2 text-xs font-bold">
                    {game.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardTitle className="text-xl">{game.name}</CardTitle>
                <CardDescription className="text-base">
                  {game.description}
                </CardDescription>
                
                <Button className="w-full text-lg font-bold h-12">
                  Play Now! 🎮
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <Card className="border-4 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              Your Gaming Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600">{games.length}</div>
                <div className="text-gray-600">Games Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-600">0</div>
                <div className="text-gray-600">Total Score</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">0</div>
                <div className="text-gray-600">Achievements</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">0</div>
                <div className="text-gray-600">Games Played</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
