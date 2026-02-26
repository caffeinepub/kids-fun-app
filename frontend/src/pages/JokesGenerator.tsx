import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Heart, Share2, Volume2, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type JokeCategory = 'animal' | 'knockKnock' | 'food' | 'school' | 'dadJokes' | 'riddles' | 'puns' | 'science';

interface Joke {
  id: string;
  category: JokeCategory;
  text: string;
  rating: number;
  isFavorite: boolean;
}

export default function JokesGenerator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const jokes: Joke[] = [
    {
      id: '1',
      category: 'animal',
      text: 'Why do fish live in saltwater? Because pepper makes them sneeze! 🐟',
      rating: 4,
      isFavorite: false,
    },
    {
      id: '2',
      category: 'knockKnock',
      text: 'Knock knock! Who\'s there? Boo. Boo who? Don\'t cry, it\'s just a joke! 👻',
      rating: 5,
      isFavorite: false,
    },
    {
      id: '3',
      category: 'food',
      text: 'What do you call cheese that isn\'t yours? Nacho cheese! 🧀',
      rating: 5,
      isFavorite: false,
    },
    {
      id: '4',
      category: 'school',
      text: 'Why did the student eat his homework? Because the teacher said it was a piece of cake! 📚',
      rating: 4,
      isFavorite: false,
    },
    {
      id: '5',
      category: 'dadJokes',
      text: 'I\'m afraid for the calendar. Its days are numbered! 📅',
      rating: 3,
      isFavorite: false,
    },
    {
      id: '6',
      category: 'riddles',
      text: 'What has hands but can\'t clap? A clock! ⏰',
      rating: 4,
      isFavorite: false,
    },
    {
      id: '7',
      category: 'puns',
      text: 'I used to hate facial hair, but then it grew on me! 😄',
      rating: 4,
      isFavorite: false,
    },
    {
      id: '8',
      category: 'science',
      text: 'Why can\'t you trust atoms? They make up everything! ⚛️',
      rating: 5,
      isFavorite: false,
    },
  ];

  const categories = [
    { id: 'animal' as JokeCategory, name: 'Animal', emoji: '🐾' },
    { id: 'knockKnock' as JokeCategory, name: 'Knock-Knock', emoji: '🚪' },
    { id: 'food' as JokeCategory, name: 'Food', emoji: '🍕' },
    { id: 'school' as JokeCategory, name: 'School', emoji: '📚' },
    { id: 'dadJokes' as JokeCategory, name: 'Dad Jokes', emoji: '👨' },
    { id: 'riddles' as JokeCategory, name: 'Riddles', emoji: '🤔' },
    { id: 'puns' as JokeCategory, name: 'Puns', emoji: '😆' },
    { id: 'science' as JokeCategory, name: 'Science', emoji: '🔬' },
  ];

  const getRandomJoke = (category?: JokeCategory) => {
    const filteredJokes = category ? jokes.filter((j) => j.category === category) : jokes;
    const randomJoke = filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
    setCurrentJoke(randomJoke);
  };

  const toggleFavorite = (jokeId: string) => {
    if (favorites.includes(jokeId)) {
      setFavorites(favorites.filter((id) => id !== jokeId));
      toast.success('Removed from favorites');
    } else {
      setFavorites([...favorites, jokeId]);
      toast.success('Added to favorites! ❤️');
    }
  };

  const handleShare = () => {
    if (!currentJoke) {
      toast.error('Please generate a joke first');
      return;
    }
    toast.success('Joke shared! 🎉');
  };

  const handlePlayAudio = () => {
    if (!currentJoke) {
      toast.error('Please generate a joke first');
      return;
    }
    toast.success('Playing joke audio... 🔊');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
          Jokes Generator 😄
        </h1>
        <p className="text-lg text-gray-700">Laugh with funny jokes and riddles</p>
      </div>

      <Card className="border-4 border-primary shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            Joke of the Moment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="min-h-[200px] bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-8 flex items-center justify-center border-4 border-dashed border-primary">
            {currentJoke ? (
              <div className="text-center space-y-4">
                <Badge className="text-lg px-4 py-1">
                  {categories.find((c) => c.id === currentJoke.category)?.emoji}{' '}
                  {categories.find((c) => c.id === currentJoke.category)?.name}
                </Badge>
                <p className="text-2xl font-semibold text-gray-800">{currentJoke.text}</p>
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < currentJoke.rating ? 'text-yellow-500' : 'text-gray-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Smile className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <p className="text-xl text-gray-600">Click a button below to get a joke!</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => getRandomJoke()} className="text-lg h-12 font-bold px-8">
              Random Joke 🎲
            </Button>
            {currentJoke && (
              <>
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(currentJoke.id)}
                  className="h-12"
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${
                      favorites.includes(currentJoke.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  Favorite
                </Button>
                <Button variant="outline" onClick={handleShare} className="h-12">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={handlePlayAudio} className="h-12">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Listen
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:scale-105"
                onClick={() => getRandomJoke(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">{category.emoji}</div>
                  <p className="font-semibold text-lg">{category.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {jokes.filter((j) => j.category === category.id).length} jokes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favorites.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl text-gray-500">No favorite jokes yet</p>
                <p className="text-gray-400">Click the heart button to save jokes you love!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jokes
                .filter((joke) => favorites.includes(joke.id))
                .map((joke) => (
                  <Card key={joke.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge>{categories.find((c) => c.id === joke.category)?.name}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(joke.id)}
                        >
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">{joke.text}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Jokes</CardTitle>
              <CardDescription>Find jokes by keyword</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for jokes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  <Search className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Try searching for: animal, food, school, science...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
