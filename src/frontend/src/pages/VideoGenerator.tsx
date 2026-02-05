import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Film, Sparkles, Download, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function VideoGenerator() {
  const [videoTitle, setVideoTitle] = useState('');
  const [duration, setDuration] = useState([30]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    { id: '1', name: 'Birthday Party', thumbnail: '🎂', description: 'Celebrate with balloons and cake' },
    { id: '2', name: 'Space Adventure', thumbnail: '🚀', description: 'Explore the galaxy' },
    { id: '3', name: 'Underwater World', thumbnail: '🐠', description: 'Dive into the ocean' },
    { id: '4', name: 'Jungle Safari', thumbnail: '🦁', description: 'Meet wild animals' },
    { id: '5', name: 'Magic Castle', thumbnail: '🏰', description: 'Enter a fairy tale' },
    { id: '6', name: 'Sports Day', thumbnail: '⚽', description: 'Play and compete' },
  ];

  const characters = [
    { id: '1', name: 'Happy Kid', emoji: '😊' },
    { id: '2', name: 'Cool Cat', emoji: '😎' },
    { id: '3', name: 'Funny Dog', emoji: '🐶' },
    { id: '4', name: 'Smart Owl', emoji: '🦉' },
    { id: '5', name: 'Brave Lion', emoji: '🦁' },
    { id: '6', name: 'Cute Bunny', emoji: '🐰' },
  ];

  const stickers = [
    '⭐', '🌟', '✨', '💫', '🎈', '🎉', '🎊', '🎁',
    '🌈', '☀️', '🌙', '⚡', '💝', '🎵', '🎨', '🎭',
  ];

  const handleCreateVideo = () => {
    if (!videoTitle.trim()) {
      toast.error('Please enter a video title');
      return;
    }
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }
    toast.success('Video created successfully! 🎬');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Video Generator 🎬
        </h1>
        <p className="text-lg text-gray-700">Create amazing 2D videos with characters and scenes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-6 h-6" />
              Video Canvas
            </CardTitle>
            <CardDescription>Your video preview will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-4 border-dashed border-primary">
              <div className="text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-xl font-semibold text-gray-700">Start creating your video!</p>
                <p className="text-gray-500">Select a template and add characters</p>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Button className="flex-1 text-lg h-12 font-bold">
                <Play className="w-5 h-5 mr-2" />
                Preview
              </Button>
              <Button variant="outline" className="flex-1 text-lg h-12">
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4">
          <CardHeader>
            <CardTitle>Video Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                placeholder="My Awesome Video"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration: {duration[0]} seconds</Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={15}
                max={120}
                step={5}
                className="w-full"
              />
            </div>
            <Button onClick={handleCreateVideo} className="w-full font-bold">
              Create Video
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer hover:shadow-lg transition-all ${
                  selectedTemplate === template.id ? 'border-4 border-primary' : 'border-2'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-5xl mb-2">{template.thumbnail}</div>
                  <p className="font-semibold text-sm">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="characters" className="mt-6">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {characters.map((character) => (
              <Card key={character.id} className="cursor-pointer hover:shadow-lg transition-all border-2">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{character.emoji}</div>
                  <p className="font-semibold text-xs">{character.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stickers" className="mt-6">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {stickers.map((sticker, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-all border-2">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl">{sticker}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="effects" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Fade In', 'Slide', 'Zoom', 'Bounce', 'Spin', 'Glow', 'Rainbow', 'Sparkle'].map((effect) => (
              <Card key={effect} className="cursor-pointer hover:shadow-lg transition-all border-2">
                <CardContent className="p-6 text-center">
                  <p className="font-semibold">{effect}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
