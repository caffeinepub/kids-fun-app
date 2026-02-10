import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetVirtualPetHub, useSaveVirtualPetHub, useGetUserRewards, useGetUserTrophies } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { Heart, Sparkles, Home, ShoppingBag, Trophy, Star, Gift, Zap } from 'lucide-react';

export default function VirtualPetHubPage() {
  const { identity } = useInternetIdentity();
  const { data: petHub, isLoading: petLoading } = useGetVirtualPetHub();
  const { data: rewards } = useGetUserRewards();
  const { data: trophies = 70 } = useGetUserTrophies();
  const savePetHub = useSaveVirtualPetHub();

  const [petName, setPetName] = useState('');
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [selectedDecoration, setSelectedDecoration] = useState<string | null>(null);
  const [selectedHomeStyle, setSelectedHomeStyle] = useState('cozy');
  const [showNameDialog, setShowNameDialog] = useState(false);

  useEffect(() => {
    if (petHub) {
      setPetName(petHub.petName);
      setSelectedHomeStyle(petHub.homeStyle || 'cozy');
    } else if (identity && !petLoading) {
      setShowNameDialog(true);
    }
  }, [petHub, identity, petLoading]);

  const accessories = [
    { id: 'hat_party', name: 'Party Hat', emoji: '🎩', cost: 50 },
    { id: 'hat_crown', name: 'Crown', emoji: '👑', cost: 100 },
    { id: 'glasses_cool', name: 'Cool Glasses', emoji: '😎', cost: 75 },
    { id: 'bow_tie', name: 'Bow Tie', emoji: '🎀', cost: 60 },
    { id: 'scarf', name: 'Scarf', emoji: '🧣', cost: 80 },
    { id: 'necklace', name: 'Necklace', emoji: '📿', cost: 90 },
  ];

  const decorations = [
    { id: 'plant', name: 'Plant', emoji: '🪴', cost: 40 },
    { id: 'lamp', name: 'Lamp', emoji: '💡', cost: 50 },
    { id: 'rug', name: 'Rug', emoji: '🧶', cost: 60 },
    { id: 'painting', name: 'Painting', emoji: '🖼️', cost: 70 },
    { id: 'bookshelf', name: 'Bookshelf', emoji: '📚', cost: 80 },
    { id: 'toy_box', name: 'Toy Box', emoji: '🧸', cost: 90 },
  ];

  const homeStyles = [
    { id: 'cozy', name: 'Cozy Cottage', emoji: '🏡', description: 'Warm and comfortable' },
    { id: 'modern', name: 'Modern Loft', emoji: '🏢', description: 'Sleek and stylish' },
    { id: 'garden', name: 'Garden Paradise', emoji: '🌳', description: 'Nature-inspired' },
    { id: 'castle', name: 'Royal Castle', emoji: '🏰', description: 'Fit for royalty' },
  ];

  const handleCreatePet = async () => {
    if (!petName.trim()) {
      toast.error('Please enter a name for your pet!');
      return;
    }

    if (!identity) {
      toast.error('Please log in first!');
      return;
    }

    try {
      await savePetHub.mutateAsync({
        userId: identity.getPrincipal(),
        petName: petName.trim(),
        happinessLevel: BigInt(50),
        growthStage: BigInt(1),
        accessories: [],
        decorations: [],
        homeStyle: 'cozy',
        warnedAboutExtremeChanges: false,
        trophies: BigInt(trophies),
      });

      toast.success(`Welcome ${petName}! 🎉`);
      setShowNameDialog(false);
    } catch (error) {
      console.error('Error creating pet:', error);
      toast.error('Failed to create pet. Please try again.');
    }
  };

  const handleFeedPet = async () => {
    if (!petHub || !identity) return;

    const newHappiness = Math.min(Number(petHub.happinessLevel) + 10, 100);
    const newGrowth = newHappiness === 100 ? Number(petHub.growthStage) + 1 : Number(petHub.growthStage);

    try {
      await savePetHub.mutateAsync({
        ...petHub,
        happinessLevel: BigInt(newHappiness),
        growthStage: BigInt(newGrowth),
      });

      toast.success('Your pet is happy! 😊');
    } catch (error) {
      console.error('Error feeding pet:', error);
      toast.error('Failed to feed pet');
    }
  };

  const handlePlayWithPet = async () => {
    if (!petHub || !identity) return;

    const newHappiness = Math.min(Number(petHub.happinessLevel) + 15, 100);
    const newGrowth = newHappiness === 100 ? Number(petHub.growthStage) + 1 : Number(petHub.growthStage);

    try {
      await savePetHub.mutateAsync({
        ...petHub,
        happinessLevel: BigInt(newHappiness),
        growthStage: BigInt(newGrowth),
      });

      toast.success('Your pet loves playing with you! 🎮');
    } catch (error) {
      console.error('Error playing with pet:', error);
      toast.error('Failed to play with pet');
    }
  };

  const handleBuyAccessory = async (accessoryId: string, cost: number) => {
    if (!petHub || !identity) return;

    if (trophies < cost) {
      toast.error(`Not enough trophies! You need ${cost} trophies.`);
      return;
    }

    if (petHub.accessories.includes(accessoryId)) {
      toast.error('You already own this accessory!');
      return;
    }

    try {
      await savePetHub.mutateAsync({
        ...petHub,
        accessories: [...petHub.accessories, accessoryId],
      });

      toast.success('Accessory purchased! 🎉');
    } catch (error) {
      console.error('Error buying accessory:', error);
      toast.error('Failed to purchase accessory');
    }
  };

  const handleBuyDecoration = async (decorationId: string, cost: number) => {
    if (!petHub || !identity) return;

    if (trophies < cost) {
      toast.error(`Not enough trophies! You need ${cost} trophies.`);
      return;
    }

    if (petHub.decorations.includes(decorationId)) {
      toast.error('You already own this decoration!');
      return;
    }

    try {
      await savePetHub.mutateAsync({
        ...petHub,
        decorations: [...petHub.decorations, decorationId],
      });

      toast.success('Decoration purchased! 🎉');
    } catch (error) {
      console.error('Error buying decoration:', error);
      toast.error('Failed to purchase decoration');
    }
  };

  const handleChangeHomeStyle = async (styleId: string) => {
    if (!petHub || !identity) return;

    try {
      await savePetHub.mutateAsync({
        ...petHub,
        homeStyle: styleId,
      });

      setSelectedHomeStyle(styleId);
      toast.success('Home style updated! 🏡');
    } catch (error) {
      console.error('Error changing home style:', error);
      toast.error('Failed to change home style');
    }
  };

  const getGrowthStageName = (stage: number) => {
    if (stage <= 1) return 'Baby';
    if (stage <= 3) return 'Child';
    if (stage <= 5) return 'Teen';
    if (stage <= 7) return 'Adult';
    return 'Elder';
  };

  const getPetEmoji = (stage: number) => {
    if (stage <= 1) return '🥚';
    if (stage <= 3) return '🐣';
    if (stage <= 5) return '🐥';
    if (stage <= 7) return '🐤';
    return '🦜';
  };

  if (petLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-lg text-gray-600">Loading your pet...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md border-4 border-purple-400 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">🐾 Virtual Pet Hub</CardTitle>
            <CardDescription className="text-lg">
              Please log in to create and care for your virtual pet!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Create Your Virtual Pet! 🐾</DialogTitle>
            <DialogDescription>
              Choose a name for your new companion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="petName">Pet Name</Label>
              <Input
                id="petName"
                placeholder="Enter a name..."
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePet()}
              />
            </div>
            <Button onClick={handleCreatePet} className="w-full" size="lg">
              Create Pet 🎉
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🐾 Virtual Pet Hub
        </h1>
        <p className="text-lg text-gray-700">Take care of your virtual companion!</p>
      </div>

      {petHub && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pet Display */}
          <Card className="lg:col-span-2 border-4 border-purple-400 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  {getPetEmoji(Number(petHub.growthStage))} {petHub.petName}
                </CardTitle>
                <Badge variant="secondary" className="text-lg">
                  {getGrowthStageName(Number(petHub.growthStage))}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pet Stats */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Happiness
                    </Label>
                    <span className="font-bold">{Number(petHub.happinessLevel)}%</span>
                  </div>
                  <Progress value={Number(petHub.happinessLevel)} className="h-3" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Growth Stage
                    </Label>
                    <span className="font-bold">Level {Number(petHub.growthStage)}</span>
                  </div>
                  <Progress value={(Number(petHub.growthStage) / 10) * 100} className="h-3" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      Trophies
                    </Label>
                    <span className="font-bold">{trophies}</span>
                  </div>
                </div>
              </div>

              {/* Pet Visual */}
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 min-h-[300px] flex items-center justify-center border-4 border-purple-300">
                <div className="text-center space-y-4">
                  <div className="text-9xl animate-bounce">
                    {getPetEmoji(Number(petHub.growthStage))}
                  </div>
                  {petHub.accessories.length > 0 && (
                    <div className="flex gap-2 justify-center flex-wrap">
                      {petHub.accessories.map((accId) => {
                        const acc = accessories.find((a) => a.id === accId);
                        return acc ? (
                          <span key={accId} className="text-4xl">
                            {acc.emoji}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Care Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleFeedPet}
                  size="lg"
                  className="gap-2"
                  disabled={savePetHub.isPending}
                >
                  <Gift className="w-5 h-5" />
                  Feed Pet
                </Button>
                <Button
                  onClick={handlePlayWithPet}
                  size="lg"
                  className="gap-2"
                  disabled={savePetHub.isPending}
                >
                  <Zap className="w-5 h-5" />
                  Play
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customization Panel */}
          <Card className="border-4 border-pink-400 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Customize
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="accessories">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="accessories">Accessories</TabsTrigger>
                  <TabsTrigger value="decorations">Decor</TabsTrigger>
                  <TabsTrigger value="home">Home</TabsTrigger>
                </TabsList>

                <TabsContent value="accessories" className="space-y-2">
                  <ScrollArea className="h-[400px]">
                    {accessories.map((accessory) => {
                      const owned = petHub.accessories.includes(accessory.id);
                      return (
                        <Card key={accessory.id} className="mb-2">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{accessory.emoji}</span>
                                <div>
                                  <p className="font-semibold">{accessory.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {accessory.cost} 🏆
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleBuyAccessory(accessory.id, accessory.cost)}
                                disabled={owned || savePetHub.isPending}
                              >
                                {owned ? 'Owned' : 'Buy'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="decorations" className="space-y-2">
                  <ScrollArea className="h-[400px]">
                    {decorations.map((decoration) => {
                      const owned = petHub.decorations.includes(decoration.id);
                      return (
                        <Card key={decoration.id} className="mb-2">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{decoration.emoji}</span>
                                <div>
                                  <p className="font-semibold">{decoration.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {decoration.cost} 🏆
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleBuyDecoration(decoration.id, decoration.cost)}
                                disabled={owned || savePetHub.isPending}
                              >
                                {owned ? 'Owned' : 'Buy'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="home" className="space-y-2">
                  <ScrollArea className="h-[400px]">
                    {homeStyles.map((style) => {
                      const selected = petHub.homeStyle === style.id;
                      return (
                        <Card key={style.id} className="mb-2">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{style.emoji}</span>
                                <div>
                                  <p className="font-semibold">{style.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {style.description}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleChangeHomeStyle(style.id)}
                                disabled={selected || savePetHub.isPending}
                                variant={selected ? 'secondary' : 'default'}
                              >
                                {selected ? 'Active' : 'Select'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
