import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function EventCardCreator() {
  const [cardTitle, setCardTitle] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('birthday');
  const [selectedFont, setSelectedFont] = useState('comic');

  const templates = [
    { id: 'birthday', name: 'Birthday', emoji: '🎂', color: 'from-pink-400 to-purple-400' },
    { id: 'thankyou', name: 'Thank You', emoji: '🙏', color: 'from-blue-400 to-cyan-400' },
    { id: 'festival', name: 'Festival', emoji: '🎉', color: 'from-yellow-400 to-orange-400' },
    { id: 'congratulations', name: 'Congrats', emoji: '🎊', color: 'from-green-400 to-teal-400' },
    { id: 'getwell', name: 'Get Well', emoji: '💐', color: 'from-red-400 to-pink-400' },
    { id: 'invitation', name: 'Invitation', emoji: '✉️', color: 'from-indigo-400 to-purple-400' },
  ];

  const stickers = ['🎈', '🎁', '🌟', '⭐', '💝', '🌈', '🎵', '🎨', '🦄', '🌸', '🍰', '🎪'];

  const borders = [
    { id: 'none', name: 'None' },
    { id: 'solid', name: 'Solid' },
    { id: 'dashed', name: 'Dashed' },
    { id: 'dotted', name: 'Dotted' },
    { id: 'double', name: 'Double' },
  ];

  const fonts = [
    { id: 'comic', name: 'Comic Sans', style: 'font-comic' },
    { id: 'cursive', name: 'Cursive', style: 'font-cursive' },
    { id: 'bold', name: 'Bold', style: 'font-bold' },
    { id: 'playful', name: 'Playful', style: 'font-playful' },
  ];

  const handleDownload = () => {
    if (!cardTitle.trim()) {
      toast.error('Please add a title to your card');
      return;
    }
    toast.success('Card downloaded successfully! 📥');
  };

  const handleShare = () => {
    if (!cardTitle.trim()) {
      toast.error('Please add a title to your card');
      return;
    }
    toast.success('Card shared successfully! 🎉');
  };

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent">
          Event Card Creator 🎨
        </h1>
        <p className="text-lg text-gray-700">Design beautiful cards for any occasion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Card Preview
            </CardTitle>
            <CardDescription>Your card design will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`aspect-[3/4] bg-gradient-to-br ${currentTemplate?.color} rounded-lg p-8 flex flex-col items-center justify-center text-center border-4 border-white shadow-2xl`}
            >
              <div className="text-6xl mb-4">{currentTemplate?.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                {cardTitle || 'Your Title Here'}
              </h2>
              <p className="text-lg text-white drop-shadow-md">
                {cardMessage || 'Your message will appear here...'}
              </p>
              <div className="mt-6 flex gap-2">
                {stickers.slice(0, 4).map((sticker, index) => (
                  <span key={index} className="text-3xl">
                    {sticker}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={handleDownload} className="flex-1 text-lg h-12 font-bold">
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1 text-lg h-12">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-4">
            <CardHeader>
              <CardTitle>Card Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Card Title</Label>
                <Input
                  id="title"
                  placeholder="Happy Birthday!"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your message here..."
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font">Font Style</Label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="stickers">Stickers</TabsTrigger>
              <TabsTrigger value="borders">Borders</TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer hover:shadow-lg transition-all ${
                          selectedTemplate === template.id ? 'border-4 border-primary' : 'border-2'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-4xl mb-2">{template.emoji}</div>
                          <p className="font-semibold text-sm">{template.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stickers">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-6 gap-4">
                    {stickers.map((sticker, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-lg transition-all border-2"
                      >
                        <CardContent className="p-3 text-center">
                          <div className="text-3xl">{sticker}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="borders">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {borders.map((border) => (
                      <Card key={border.id} className="cursor-pointer hover:shadow-lg transition-all border-2">
                        <CardContent className="p-4 text-center">
                          <p className="font-semibold">{border.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
