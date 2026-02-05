import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Clock, TrendingUp, Star, Loader2 } from 'lucide-react';
import { ModulePage } from '../App';
import { useGetMyGameStates, useGetUserRewards } from '../hooks/useQueries';

interface SmartHubPageProps {
  onNavigate: (page: ModulePage) => void;
}

interface ActivityItem {
  id: string;
  title: string;
  type: 'game' | 'educational' | 'creative';
  difficulty: 'Easy' | 'Medium';
  icon: string;
  page: ModulePage;
  category: string;
}

const allActivities: ActivityItem[] = [
  // Games - Easy
  { id: 'balloon-pop', title: 'Balloon Pop', type: 'game', difficulty: 'Easy', icon: '/assets/generated/balloon-pop-game.dim_200x200.png', page: 'game:balloon-pop', category: 'Arcade' },
  { id: 'memory-match', title: 'Memory Match', type: 'game', difficulty: 'Easy', icon: '/assets/generated/memory-match-game.dim_200x200.png', page: 'game:memory-match', category: 'Puzzle' },
  { id: 'birthday-cake-maker', title: 'Birthday Cake Maker', type: 'game', difficulty: 'Easy', icon: '/assets/generated/birthday-cake-maker-game.dim_200x200.png', page: 'game:birthday-cake-maker', category: 'Creative' },
  { id: 'birthday-cake-decorator', title: 'Birthday Cake Decorator', type: 'game', difficulty: 'Easy', icon: '/assets/generated/birthday-cake-decorator-game.dim_200x200.png', page: 'game:birthday-cake-decorator', category: 'Creative' },
  
  // Games - Medium
  { id: 'word-wizard', title: 'Word Wizard', type: 'game', difficulty: 'Medium', icon: '/assets/generated/word-wizard-game.dim_200x200.png', page: 'game:word-wizard', category: 'Puzzle' },
  { id: 'number-runner', title: 'Number Runner', type: 'game', difficulty: 'Medium', icon: '/assets/generated/number-runner-game.dim_200x200.png', page: 'game:number-runner', category: 'Educational' },
  { id: 'super-speedy-racer', title: 'Super Speedy Racer', type: 'game', difficulty: 'Medium', icon: '/assets/generated/super-speedy-racer-game.dim_200x200.png', page: 'game:super-speedy-racer', category: 'Racing' },
  { id: 'ambulance-rescue', title: 'Ambulance Rescue', type: 'game', difficulty: 'Medium', icon: '/assets/generated/ambulance-rescue-game.dim_200x200.png', page: 'game:ambulance-rescue', category: 'Action' },
  { id: 'eclipse-now-solo', title: 'Eclipse Now Solo', type: 'game', difficulty: 'Medium', icon: '/assets/generated/eclipse-now-solo-game.dim_200x200.png', page: 'game:eclipse-now-solo', category: 'Adventure' },
  { id: 'forest-night', title: 'Forest Night', type: 'game', difficulty: 'Medium', icon: '/assets/generated/forest-night-game.dim_200x200.png', page: 'game:forest-night', category: 'Adventure' },
  
  // Educational - Easy
  { id: 'learn-hub', title: 'Learn Hub', type: 'educational', difficulty: 'Easy', icon: '/assets/generated/learn-hub-icon.dim_64x64.png', page: 'learn-hub', category: 'Education' },
  { id: 'craft-diy', title: 'Craft & DIY', type: 'educational', difficulty: 'Easy', icon: '/assets/generated/craft-tools-icon.dim_64x64.png', page: 'craft-diy', category: 'Creative' },
  
  // Creative - Easy
  { id: 'sticker-creator', title: 'Sticker Creator', type: 'creative', difficulty: 'Easy', icon: '/assets/generated/sticker-creator-canvas.dim_400x300.png', page: 'sticker-creator', category: 'Creative' },
  { id: 'avatar-creator', title: 'Avatar Creator', type: 'creative', difficulty: 'Easy', icon: '/assets/generated/avatar-creator-icon.dim_64x64.png', page: 'avatar-creator', category: 'Creative' },
  { id: 'art-gallery', title: 'Art Gallery', type: 'creative', difficulty: 'Easy', icon: '/assets/generated/art-gallery-icon.dim_64x64.png', page: 'art-gallery', category: 'Creative' },
  
  // Creative - Medium
  { id: 'story-builder', title: 'Story Builder', type: 'creative', difficulty: 'Medium', icon: '/assets/generated/story-book-icon.dim_64x64.png', page: 'story-builder', category: 'Creative' },
  { id: 'music-remix', title: 'Music Remix', type: 'creative', difficulty: 'Medium', icon: '/assets/generated/music-remix-interface.dim_400x250.png', page: 'music-remix', category: 'Creative' },
  { id: 'video-generator', title: 'Video Generator', type: 'creative', difficulty: 'Medium', icon: '/assets/generated/video-generator-icon.dim_64x64.png', page: 'video-generator', category: 'Creative' },
];

// Helper function to safely load from localStorage
function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
  }
  return defaultValue;
}

// Helper function to safely save to localStorage
function saveToLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export default function SmartHubPage({ onNavigate }: SmartHubPageProps) {
  // Initialize all state with stable defaults
  const [isInitialized, setIsInitialized] = useState(false);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium'>(() => {
    const stored = loadFromLocalStorage<string>('smartHub_difficulty', 'Easy');
    return stored === 'Medium' ? 'Medium' : 'Easy';
  });
  
  const { data: gameStates = [], isLoading: isLoadingGames } = useGetMyGameStates();
  const { data: rewards, isLoading: isLoadingRewards } = useGetUserRewards();

  // Load recently played activities
  const recentlyPlayed = useMemo(() => {
    const storedIds = loadFromLocalStorage<string[]>('smartHub_recentlyPlayed', []);
    return storedIds
      .map(id => allActivities.find(a => a.id === id))
      .filter((a): a is ActivityItem => a !== undefined)
      .slice(0, 5);
  }, []);

  // Generate daily pick with stable logic
  const dailyPick = useMemo(() => {
    const today = new Date().toDateString();
    const storedDate = loadFromLocalStorage<string>('smartHub_dailyPickDate', '');
    const storedPickId = loadFromLocalStorage<string>('smartHub_dailyPick', '');

    // Check if we have a valid daily pick for today
    if (storedDate === today && storedPickId) {
      const activity = allActivities.find(a => a.id === storedPickId);
      if (activity && activity.difficulty === difficulty) {
        return activity;
      }
    }

    // Generate new daily pick
    const filteredActivities = allActivities.filter(a => a.difficulty === difficulty);
    if (filteredActivities.length === 0) return null;
    
    const randomActivity = filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
    
    // Save new daily pick
    saveToLocalStorage('smartHub_dailyPickDate', today);
    saveToLocalStorage('smartHub_dailyPick', randomActivity.id);
    
    return randomActivity;
  }, [difficulty]);

  // Generate recommendations based on user activity
  const recommendations = useMemo(() => {
    const filteredByDifficulty = allActivities.filter(a => a.difficulty === difficulty);
    
    // Get user's most played game categories
    const categoryCount: Record<string, number> = {};
    gameStates.forEach(gs => {
      const activity = allActivities.find(a => a.id === gs.gameName);
      if (activity) {
        categoryCount[activity.category] = (categoryCount[activity.category] || 0) + 1;
      }
    });

    // Sort categories by frequency
    const topCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    // Generate recommendations
    let recommended: ActivityItem[] = [];

    // Add activities from top categories
    topCategories.forEach(category => {
      const categoryActivities = filteredByDifficulty.filter(a => 
        a.category === category && !recentlyPlayed.some(r => r.id === a.id)
      );
      recommended = [...recommended, ...categoryActivities.slice(0, 2)];
    });

    // Fill remaining slots with random activities
    const remaining = filteredByDifficulty.filter(a => 
      !recommended.some(r => r.id === a.id) && 
      !recentlyPlayed.some(r => r.id === a.id)
    );
    
    while (recommended.length < 6 && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      recommended.push(remaining[randomIndex]);
      remaining.splice(randomIndex, 1);
    }

    return recommended.slice(0, 6);
  }, [difficulty, gameStates, recentlyPlayed]);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleActivityClick = (activity: ActivityItem) => {
    // Update recently played
    const currentIds = recentlyPlayed.map(a => a.id);
    const updated = [activity.id, ...currentIds.filter(id => id !== activity.id)].slice(0, 5);
    saveToLocalStorage('smartHub_recentlyPlayed', updated);
    
    // Navigate to activity
    onNavigate(activity.page);
  };

  const handleDifficultyChange = (checked: boolean) => {
    const newDifficulty = checked ? 'Medium' : 'Easy';
    setDifficulty(newDifficulty);
    saveToLocalStorage('smartHub_difficulty', newDifficulty);
  };

  // Show loading state while data is being fetched
  if (!isInitialized || isLoadingGames || isLoadingRewards) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-neon-purple animate-spin mx-auto" />
          <p className="text-2xl text-neon-cyan text-shadow-neon-md">
            Loading your Smart Hub...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-12 h-12 text-neon-pink animate-neon-pulse" />
          <h1 className="text-5xl font-bold text-neon-purple text-shadow-neon-lg">
            Smart Hub
          </h1>
          <Sparkles className="w-12 h-12 text-neon-green animate-neon-pulse" />
        </div>
        <p className="text-2xl text-neon-cyan text-shadow-neon-md">
          Your personalized activity center!
        </p>
      </div>

      {/* Difficulty Filter */}
      <Card className="border-4 border-neon-purple shadow-neon-purple bg-card/90 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="difficulty-toggle" className="text-xl font-bold text-neon-purple text-shadow-neon-sm">
                Difficulty Level
              </Label>
              <p className="text-sm text-muted-foreground">
                Filter activities by difficulty
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold ${difficulty === 'Easy' ? 'text-neon-green text-shadow-neon-md' : 'text-muted-foreground'}`}>
                Easy
              </span>
              <Switch
                id="difficulty-toggle"
                checked={difficulty === 'Medium'}
                onCheckedChange={handleDifficultyChange}
                className="data-[state=checked]:bg-neon-orange"
              />
              <span className={`text-lg font-bold ${difficulty === 'Medium' ? 'text-neon-orange text-shadow-neon-md' : 'text-muted-foreground'}`}>
                Medium
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Pick */}
      {dailyPick && (
        <Card className="border-4 border-neon-pink shadow-neon-pink bg-gradient-to-br from-neon-pink/10 to-neon-purple/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-neon-pink animate-neon-pulse" />
              <CardTitle className="text-3xl text-neon-pink text-shadow-neon-lg">
                Daily Pick ⭐
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Today's featured activity just for you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="flex items-center gap-6 p-6 bg-card/80 rounded-xl border-2 border-neon-pink cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleActivityClick(dailyPick)}
            >
              <img 
                src={dailyPick.icon} 
                alt={dailyPick.title}
                className="w-24 h-24 rounded-lg shadow-neon-pink"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-neon-purple text-shadow-neon-md mb-2">
                  {dailyPick.title}
                </h3>
                <div className="flex gap-2">
                  <Badge className="bg-neon-cyan text-background">
                    {dailyPick.type}
                  </Badge>
                  <Badge className="bg-neon-green text-background">
                    {dailyPick.difficulty}
                  </Badge>
                  <Badge className="bg-neon-orange text-background">
                    {dailyPick.category}
                  </Badge>
                </div>
              </div>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold shadow-neon-pink hover:shadow-neon-purple transition-all"
              >
                Play Now!
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-neon-cyan" />
            <h2 className="text-3xl font-bold text-neon-cyan text-shadow-neon-lg">
              Recently Played
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {recentlyPlayed.map((activity) => (
              <Card
                key={activity.id}
                className="border-4 border-neon-cyan shadow-neon-cyan cursor-pointer hover:scale-105 transition-transform bg-card/90 backdrop-blur-md"
                onClick={() => handleActivityClick(activity)}
              >
                <CardContent className="p-4 space-y-3">
                  <img 
                    src={activity.icon} 
                    alt={activity.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-neon-purple text-shadow-neon-sm">
                    {activity.title}
                  </h3>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {activity.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {activity.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommended for You */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-neon-green" />
          <h2 className="text-3xl font-bold text-neon-green text-shadow-neon-lg">
            Recommended for You
          </h2>
        </div>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((activity) => (
              <Card
                key={activity.id}
                className="border-4 border-neon-green shadow-neon-green cursor-pointer hover:scale-105 transition-transform bg-card/90 backdrop-blur-md"
                onClick={() => handleActivityClick(activity)}
              >
                <CardHeader className="pb-3">
                  <img 
                    src={activity.icon} 
                    alt={activity.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <CardTitle className="text-xl text-neon-purple text-shadow-neon-md">
                    {activity.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-neon-cyan text-background">
                      {activity.type}
                    </Badge>
                    <Badge className="bg-neon-orange text-background">
                      {activity.difficulty}
                    </Badge>
                    <Badge className="bg-neon-purple text-background">
                      {activity.category}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-neon-green to-neon-cyan text-background font-bold shadow-neon-green hover:shadow-neon-cyan transition-all"
                  >
                    Start Activity
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-4 border-neon-green shadow-neon-green bg-card/90 backdrop-blur-md">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-neon-purple text-shadow-neon-sm">
                Play some activities to get personalized recommendations!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
