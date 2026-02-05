import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { useSaveAvatarConfig, useGetCallerUserProfile } from '../hooks/useQueries';

export default function AvatarCreatorPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveAvatar = useSaveAvatarConfig();

  const [avatarConfig, setAvatarConfig] = useState({
    body: 'body1',
    head: 'head1',
    hair: 'hair1',
    pants: 'pants1',
    headwear: 'none',
    shoes: 'shoes1',
  });

  const avatarParts = {
    body: ['body1', 'body2', 'body3', 'body4'],
    head: ['head1', 'head2', 'head3', 'head4'],
    hair: ['hair1', 'hair2', 'hair3', 'hair4', 'hair5', 'hair6'],
    pants: ['pants1', 'pants2', 'pants3', 'pants4'],
    headwear: ['none', 'hat1', 'hat2', 'crown', 'cap'],
    shoes: ['shoes1', 'shoes2', 'shoes3', 'shoes4'],
  };

  const partEmojis: Record<string, Record<string, string>> = {
    body: { body1: '👕', body2: '👔', body3: '🎽', body4: '🦺' },
    head: { head1: '😊', head2: '😄', head3: '😎', head4: '🤓' },
    hair: { hair1: '💇', hair2: '💇‍♂️', hair3: '🦱', hair4: '🦰', hair5: '🦳', hair6: '🦲' },
    pants: { pants1: '👖', pants2: '🩳', pants3: '👗', pants4: '🩱' },
    headwear: { none: '❌', hat1: '🎩', hat2: '👒', crown: '👑', cap: '🧢' },
    shoes: { shoes1: '👟', shoes2: '👞', shoes3: '👠', shoes4: '🥾' },
  };

  const updatePart = (category: keyof typeof avatarConfig, value: string) => {
    setAvatarConfig((prev) => ({ ...prev, [category]: value }));
  };

  const randomize = () => {
    const randomConfig = {
      body: avatarParts.body[Math.floor(Math.random() * avatarParts.body.length)],
      head: avatarParts.head[Math.floor(Math.random() * avatarParts.head.length)],
      hair: avatarParts.hair[Math.floor(Math.random() * avatarParts.hair.length)],
      pants: avatarParts.pants[Math.floor(Math.random() * avatarParts.pants.length)],
      headwear: avatarParts.headwear[Math.floor(Math.random() * avatarParts.headwear.length)],
      shoes: avatarParts.shoes[Math.floor(Math.random() * avatarParts.shoes.length)],
    };
    setAvatarConfig(randomConfig);
    toast.success('Avatar randomized! 🎲');
  };

  const handleSave = async () => {
    try {
      await saveAvatar.mutateAsync(avatarConfig);
      toast.success('Avatar saved successfully! 🎉');
    } catch (error) {
      toast.error('Failed to save avatar');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
          Avatar Creator 🎭
        </h1>
        <p className="text-xl text-gray-700">Create your unique character!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-4">
          <CardHeader className="text-center">
            <CardTitle>Your Avatar</CardTitle>
            <CardDescription>Preview your creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 border-4 border-primary">
              <div className="text-center space-y-2">
                {avatarConfig.headwear !== 'none' && (
                  <div className="text-6xl">{partEmojis.headwear[avatarConfig.headwear]}</div>
                )}
                <div className="text-6xl">{partEmojis.hair[avatarConfig.hair]}</div>
                <div className="text-7xl">{partEmojis.head[avatarConfig.head]}</div>
                <div className="text-6xl">{partEmojis.body[avatarConfig.body]}</div>
                <div className="text-6xl">{partEmojis.pants[avatarConfig.pants]}</div>
                <div className="text-5xl">{partEmojis.shoes[avatarConfig.shoes]}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={randomize} variant="outline" className="flex-1">
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              <Button onClick={handleSave} disabled={saveAvatar.isPending} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="head" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="head">Head</TabsTrigger>
              <TabsTrigger value="hair">Hair</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="pants">Pants</TabsTrigger>
              <TabsTrigger value="headwear">Headwear</TabsTrigger>
              <TabsTrigger value="shoes">Shoes</TabsTrigger>
            </TabsList>

            {Object.entries(avatarParts).map(([category, parts]) => (
              <TabsContent key={category} value={category} className="mt-6">
                <Card className="border-4">
                  <CardHeader>
                    <CardTitle className="capitalize">Choose {category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {parts.map((part) => (
                        <Card
                          key={part}
                          className={`cursor-pointer hover:shadow-lg transition-all ${
                            avatarConfig[category as keyof typeof avatarConfig] === part
                              ? 'border-4 border-primary scale-110'
                              : 'border-2'
                          }`}
                          onClick={() => updatePart(category as keyof typeof avatarConfig, part)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="text-5xl">{partEmojis[category][part]}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
