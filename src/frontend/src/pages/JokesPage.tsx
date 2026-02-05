import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Smile, Send, Sparkles, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllJokes, useGetJokesByCategory, useSubmitJoke, useRateJoke, useAddJokeToFavorites, useRemoveJokeFromFavorites, useGetMyFavoriteJokes } from '../hooks/useQueries';

type JokeCategory = 'Animal' | 'Knock-knock' | 'Food' | 'School' | 'Dad' | 'Riddle' | 'Pun' | 'Science';

export default function JokesPage() {
  const [selectedCategory, setSelectedCategory] = useState<JokeCategory | 'all'>('all');
  const [newJokeText, setNewJokeText] = useState('');
  const [newJokeCategory, setNewJokeCategory] = useState<JokeCategory>('Animal');
  const [randomJoke, setRandomJoke] = useState<any>(null);
  
  const { data: allJokes, isLoading: allJokesLoading } = useGetAllJokes();
  const { data: categoryJokes, isLoading: categoryLoading } = useGetJokesByCategory(selectedCategory !== 'all' ? selectedCategory : undefined);
  const { data: favoriteJokes } = useGetMyFavoriteJokes();
  const submitJoke = useSubmitJoke();
  const rateJoke = useRateJoke();
  const addToFavorites = useAddJokeToFavorites();
  const removeFromFavorites = useRemoveJokeFromFavorites();

  const jokes = selectedCategory === 'all' ? allJokes : categoryJokes;
  const isLoading = selectedCategory === 'all' ? allJokesLoading : categoryLoading;

  const categories: Array<{ value: JokeCategory | 'all'; label: string; emoji: string }> = [
    { value: 'all', label: 'All Jokes', emoji: '😄' },
    { value: 'Animal', label: 'Animal', emoji: '🐶' },
    { value: 'Knock-knock', label: 'Knock Knock', emoji: '🚪' },
    { value: 'Food', label: 'Food', emoji: '🍕' },
    { value: 'School', label: 'School', emoji: '📚' },
    { value: 'Dad', label: 'Dad Jokes', emoji: '👨' },
    { value: 'Riddle', label: 'Riddles', emoji: '🤔' },
    { value: 'Pun', label: 'Puns', emoji: '😆' },
    { value: 'Science', label: 'Science', emoji: '🔬' },
  ];

  const handleSubmitJoke = async () => {
    if (!newJokeText.trim()) {
      toast.error('Please write a joke');
      return;
    }

    try {
      await submitJoke.mutateAsync({
        category: newJokeCategory,
        content: newJokeText,
      });
      toast.success('Joke submitted! It will appear after approval 🎉');
      setNewJokeText('');
    } catch (error) {
      toast.error('Failed to submit joke');
      console.error(error);
    }
  };

  const handleRateJoke = async (jokeId: string, rating: number) => {
    try {
      await rateJoke.mutateAsync({ jokeId, rating: BigInt(rating) });
      toast.success('Thanks for rating! ⭐');
    } catch (error) {
      toast.error('Failed to rate joke');
      console.error(error);
    }
  };

  const handleToggleFavorite = async (jokeId: string) => {
    const isFavorite = favoriteJokes?.some(j => j.id === jokeId);
    
    try {
      if (isFavorite) {
        await removeFromFavorites.mutateAsync(jokeId);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites.mutateAsync(jokeId);
        toast.success('Added to favorites! ❤️');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error(error);
    }
  };

  const handleRandomJoke = () => {
    if (jokes && jokes.length > 0) {
      const random = jokes[Math.floor(Math.random() * jokes.length)];
      setRandomJoke(random);
    }
  };

  const isFavorite = (jokeId: string) => {
    return favoriteJokes?.some(j => j.id === jokeId) || false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
          Jokes & Riddles 😄
        </h1>
        <p className="text-lg text-gray-700">Laugh and share funny jokes</p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Jokes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="submit">Submit Joke</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6 space-y-6">
          <Card className="border-4">
            <CardHeader>
              <CardTitle>Filter by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat.value)}
                    className="gap-2"
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={handleRandomJoke}
                variant="secondary"
                className="w-full gap-2"
                disabled={!jokes || jokes.length === 0}
              >
                <Shuffle className="w-5 h-5" />
                Random Joke
              </Button>
            </CardContent>
          </Card>

          {randomJoke && (
            <Card className="border-4 border-yellow-400 bg-yellow-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="bg-yellow-200">
                    {categories.find(c => c.value === randomJoke.category)?.emoji} Random Pick!
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRandomJoke(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{randomJoke.content}</p>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading jokes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jokes && jokes.length > 0 ? (
                jokes.map((joke) => (
                  <Card key={joke.id} className="border-4 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">
                          {categories.find(c => c.value === joke.category)?.emoji} {categories.find(c => c.value === joke.category)?.label}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <span className="text-sm font-semibold">
                              {Number(joke.rating)}/5
                            </span>
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(joke.id)}
                            className={isFavorite(joke.id) ? 'text-red-500' : 'text-gray-400'}
                          >
                            {isFavorite(joke.id) ? '❤️' : '🤍'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-lg">{joke.content}</p>
                      <div className="flex gap-2 flex-wrap">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant="outline"
                            size="sm"
                            onClick={() => handleRateJoke(joke.id, rating)}
                            disabled={rateJoke.isPending}
                          >
                            {'⭐'.repeat(rating)}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-4 border-dashed col-span-full">
                  <CardContent className="py-12 text-center">
                    <Smile className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-xl text-gray-500">No jokes yet in this category</p>
                    <p className="text-gray-400">Be the first to submit one!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteJokes && favoriteJokes.length > 0 ? (
              favoriteJokes.map((joke) => (
                <Card key={joke.id} className="border-4 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">
                        {categories.find(c => c.value === joke.category)?.emoji} {categories.find(c => c.value === joke.category)?.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(joke.id)}
                        className="text-red-500"
                      >
                        ❤️
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg">{joke.content}</p>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateJoke(joke.id, rating)}
                          disabled={rateJoke.isPending}
                        >
                          {'⭐'.repeat(rating)}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-4 border-dashed col-span-full">
                <CardContent className="py-12 text-center">
                  <Smile className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-500">No favorite jokes yet</p>
                  <p className="text-gray-400">Click the heart icon on jokes to add them to favorites!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submit" className="mt-6">
          <Card className="border-4 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-6 h-6" />
                Submit Your Joke
              </CardTitle>
              <CardDescription>
                Share a funny joke with everyone! It will be reviewed before appearing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newJokeCategory}
                  onValueChange={(value) => setNewJokeCategory(value as JokeCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.value !== 'all').map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.emoji} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Joke</label>
                <Textarea
                  placeholder="Write your joke here..."
                  value={newJokeText}
                  onChange={(e) => setNewJokeText(e.target.value)}
                  rows={6}
                />
              </div>

              <Button
                onClick={handleSubmitJoke}
                disabled={submitJoke.isPending}
                size="lg"
                className="w-full gap-2"
              >
                <Send className="w-5 h-5" />
                {submitJoke.isPending ? 'Submitting...' : 'Submit Joke'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
