import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Sparkles, 
  Home, 
  Shirt, 
  Gift, 
  Star,
  TrendingUp,
  Smile,
  Laugh,
  PartyPopper,
  Crown
} from 'lucide-react';
import { useGetVirtualPetHub, useSaveVirtualPetHub, useGetUserRewards } from '../hooks/useQueries';
import { toast } from 'sonner';
import { triggerAchievementCelebration } from '../components/AchievementCelebration';
import { showEmotionFeedback } from '../components/EmotionFeedback';
import { ModulePage } from '../App';

interface VirtualPetHubPageProps {
  onNavigate: (page: ModulePage) => void;
}

export default function VirtualPetHubPage({ onNavigate }: VirtualPetHubPageProps) {
  const { data: petHub, isLoading } = useGetVirtualPetHub();
  const { data: userRewards } = useGetUserRewards();
  const savePetHubMutation = useSaveVirtualPetHub();

  const [petName, setPetName] = useState('');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [homeStyle, setHomeStyle] = useState('Cozy');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (petHub && !isInitialized) {
      setPetName(petHub.petName);
      setSelectedAccessories(petHub.accessories);
      setSelectedDecorations(petHub.decorations);
      setHomeStyle(petHub.homeStyle);
      setIsInitialized(true);
    }
  }, [petHub, isInitialized]);

  const totalPoints = userRewards?.points || 0;
  const happinessLevel = petHub?.happinessLevel ? Number(petHub.happinessLevel) : 50;
  const growthStage = petHub?.growthStage ? Number(petHub.growthStage) : 1;

  const availableAccessories = [
    { id: 'hat-party', name: 'Party Hat', icon: '🎩', unlockPoints: 0 },
    { id: 'collar-gold', name: 'Gold Collar', icon: '⭐', unlockPoints: 500 },
    { id: 'bow-pink', name: 'Pink Bow', icon: '🎀', unlockPoints: 300 },
    { id: 'sunglasses', name: 'Cool Sunglasses', icon: '😎', unlockPoints: 700 },
    { id: 'crown', name: 'Royal Crown', icon: '👑', unlockPoints: 1000 },
    { id: 'scarf', name: 'Cozy Scarf', icon: '🧣', unlockPoints: 400 },
  ];

  const availableDecorations = [
    { id: 'ball', name: 'Play Ball', icon: '⚽', unlockPoints: 0 },
    { id: 'plant', name: 'House Plant', icon: '🌱', unlockPoints: 200 },
    { id: 'cushion', name: 'Soft Cushion', icon: '🛋️', unlockPoints: 300 },
    { id: 'toy-box', name: 'Toy Box', icon: '🎁', unlockPoints: 500 },
    { id: 'lamp', name: 'Fancy Lamp', icon: '💡', unlockPoints: 600 },
    { id: 'rug', name: 'Colorful Rug', icon: '🎨', unlockPoints: 400 },
  ];

  const homeStyles = [
    { id: 'Cozy', name: 'Cozy Home', color: 'from-orange-400 to-red-400' },
    { id: 'Modern', name: 'Modern Space', color: 'from-blue-400 to-purple-400' },
    { id: 'Garden', name: 'Garden Paradise', color: 'from-green-400 to-teal-400' },
    { id: 'Castle', name: 'Royal Castle', color: 'from-purple-400 to-pink-400' },
  ];

  const getMoodIcon = () => {
    if (happinessLevel >= 80) return <PartyPopper className="w-12 h-12 text-yellow-500" />;
    if (happinessLevel >= 60) return <Laugh className="w-12 h-12 text-green-500" />;
    if (happinessLevel >= 40) return <Smile className="w-12 h-12 text-blue-500" />;
    return <Heart className="w-12 h-12 text-pink-500" />;
  };

  const getMoodText = () => {
    if (happinessLevel >= 80) return 'Joyful';
    if (happinessLevel >= 60) return 'Excited';
    if (happinessLevel >= 40) return 'Content';
    return 'Happy';
  };

  const getPetImage = () => {
    if (happinessLevel >= 80) return '/assets/generated/virtual-pet-joyful.dim_200x200.png';
    if (happinessLevel >= 60) return '/assets/generated/virtual-pet-excited.dim_200x200.png';
    if (happinessLevel >= 40) return '/assets/generated/virtual-pet-content.dim_200x200.png';
    return '/assets/generated/virtual-pet-happy.dim_200x200.png';
  };

  const handleInitializePet = async () => {
    if (!petName.trim()) {
      toast.error('Please enter a name for your pet!');
      return;
    }

    try {
      await savePetHubMutation.mutateAsync({
        petName: petName.trim(),
        happinessLevel: 50,
        growthStage: 1,
        accessories: [],
        decorations: [],
        homeStyle: 'Cozy',
      });
      toast.success(`Welcome ${petName}! 🎉`);
      showEmotionFeedback('Your pet is so happy to meet you!');
      triggerAchievementCelebration('Pet Created!', 'confetti');
    } catch (error) {
      console.error('Error creating pet:', error);
      toast.error('Failed to create pet. Please try again.');
    }
  };

  const handleToggleAccessory = (accessoryId: string) => {
    const accessory = availableAccessories.find(a => a.id === accessoryId);
    if (!accessory) return;

    if (totalPoints < accessory.unlockPoints) {
      toast.error(`You need ${accessory.unlockPoints} points to unlock this accessory!`);
      return;
    }

    const newAccessories = selectedAccessories.includes(accessoryId)
      ? selectedAccessories.filter(id => id !== accessoryId)
      : [...selectedAccessories, accessoryId];

    setSelectedAccessories(newAccessories);
    toast.success(
      selectedAccessories.includes(accessoryId)
        ? `Removed ${accessory.name}`
        : `Added ${accessory.name}!`
    );
  };

  const handleToggleDecoration = (decorationId: string) => {
    const decoration = availableDecorations.find(d => d.id === decorationId);
    if (!decoration) return;

    if (totalPoints < decoration.unlockPoints) {
      toast.error(`You need ${decoration.unlockPoints} points to unlock this decoration!`);
      return;
    }

    const newDecorations = selectedDecorations.includes(decorationId)
      ? selectedDecorations.filter(id => id !== decorationId)
      : [...selectedDecorations, decorationId];

    setSelectedDecorations(newDecorations);
    toast.success(
      selectedDecorations.includes(decorationId)
        ? `Removed ${decoration.name}`
        : `Added ${decoration.name}!`
    );
  };

  const handleSaveChanges = async () => {
    if (!petHub) return;

    try {
      await savePetHubMutation.mutateAsync({
        petName,
        happinessLevel: Number(petHub.happinessLevel),
        growthStage: Number(petHub.growthStage),
        accessories: selectedAccessories,
        decorations: selectedDecorations,
        homeStyle,
      });
      toast.success('Pet customization saved! 🎉');
      showEmotionFeedback('Your pet loves the new look!');
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const handleFeedPet = () => {
    showEmotionFeedback('Yummy! Your pet is so happy!');
    toast.success('Your pet enjoyed the treat! 🍖');
  };

  const handlePlayWithPet = () => {
    showEmotionFeedback('Playtime is the best!');
    toast.success('Your pet had so much fun! 🎾');
    triggerAchievementCelebration('Play Time!', 'confetti');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 animate-spin text-purple-600" />
          <p className="text-xl font-bold text-black">Loading your pet...</p>
        </div>
      </div>
    );
  }

  if (!petHub) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Your Virtual Pet! 🐾
          </h1>
          <p className="text-lg text-black">Give your new friend a name to get started!</p>
        </div>

        <Card className="border-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Welcome to Virtual Pet Hub
            </CardTitle>
            <CardDescription className="text-black">
              Your pet will grow and learn as you earn points from games, spin rewards, and activities!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-9xl mb-4">🐶</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="petName" className="text-lg font-bold text-black">
                Pet Name
              </Label>
              <Input
                id="petName"
                placeholder="Enter a name for your pet..."
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="text-lg text-black"
              />
            </div>

            <Button
              size="lg"
              onClick={handleInitializePet}
              disabled={savePetHubMutation.isPending}
              className="w-full text-xl py-6"
            >
              {savePetHubMutation.isPending ? 'Creating...' : 'Create My Pet! 🎉'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Virtual Pet Hub 🐾
        </h1>
        <p className="text-lg text-black">Take care of {petName} and watch them grow!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Heart className="w-6 h-6 text-pink-600" />
                {petName}
              </CardTitle>
              <CardDescription className="text-black">Growth Stage {growthStage} • {getMoodText()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <div 
                  className={`rounded-3xl p-8 bg-gradient-to-br ${homeStyles.find(s => s.id === homeStyle)?.color || 'from-orange-400 to-red-400'}`}
                  style={{
                    backgroundImage: 'url(/assets/generated/pet-home-background.dim_400x300.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={getPetImage()} 
                        alt={petName}
                        className="w-48 h-48 mx-auto animate-bounce"
                      />
                      {selectedAccessories.map((accId) => {
                        const acc = availableAccessories.find(a => a.id === accId);
                        return acc ? (
                          <div key={accId} className="absolute top-0 right-0 text-4xl">
                            {acc.icon}
                          </div>
                        ) : null;
                      })}
                    </div>
                    
                    <div className="flex justify-center gap-4 flex-wrap">
                      {selectedDecorations.map((decId) => {
                        const dec = availableDecorations.find(d => d.id === decId);
                        return dec ? (
                          <div key={decId} className="text-3xl">
                            {dec.icon}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleFeedPet} className="flex-1" variant="outline">
                  🍖 Feed
                </Button>
                <Button onClick={handlePlayWithPet} className="flex-1" variant="outline">
                  🎾 Play
                </Button>
                <Button onClick={() => onNavigate('games')} className="flex-1">
                  🎮 Play Games
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="accessories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accessories" className="text-black">
                <Shirt className="w-4 h-4 mr-2" />
                Accessories
              </TabsTrigger>
              <TabsTrigger value="decorations" className="text-black">
                <Gift className="w-4 h-4 mr-2" />
                Decorations
              </TabsTrigger>
              <TabsTrigger value="home" className="text-black">
                <Home className="w-4 h-4 mr-2" />
                Home Style
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accessories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Dress Up Your Pet</CardTitle>
                  <CardDescription className="text-black">Unlock accessories by earning points!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableAccessories.map((accessory) => {
                      const isUnlocked = totalPoints >= accessory.unlockPoints;
                      const isSelected = selectedAccessories.includes(accessory.id);

                      return (
                        <Card
                          key={accessory.id}
                          className={`cursor-pointer transition-all ${
                            isSelected ? 'border-4 border-purple-500 bg-purple-50' : 'border-2'
                          } ${!isUnlocked ? 'opacity-50' : 'hover:scale-105'}`}
                          onClick={() => isUnlocked && handleToggleAccessory(accessory.id)}
                        >
                          <CardContent className="p-4 text-center space-y-2">
                            <div className="text-4xl">{accessory.icon}</div>
                            <p className="font-bold text-sm text-black">{accessory.name}</p>
                            {!isUnlocked && (
                              <Badge variant="secondary" className="text-xs">
                                {accessory.unlockPoints} pts
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge className="bg-green-500">Equipped</Badge>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decorations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Decorate Pet's Home</CardTitle>
                  <CardDescription className="text-black">Make your pet's space cozy and fun!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableDecorations.map((decoration) => {
                      const isUnlocked = totalPoints >= decoration.unlockPoints;
                      const isSelected = selectedDecorations.includes(decoration.id);

                      return (
                        <Card
                          key={decoration.id}
                          className={`cursor-pointer transition-all ${
                            isSelected ? 'border-4 border-green-500 bg-green-50' : 'border-2'
                          } ${!isUnlocked ? 'opacity-50' : 'hover:scale-105'}`}
                          onClick={() => isUnlocked && handleToggleDecoration(decoration.id)}
                        >
                          <CardContent className="p-4 text-center space-y-2">
                            <div className="text-4xl">{decoration.icon}</div>
                            <p className="font-bold text-sm text-black">{decoration.name}</p>
                            {!isUnlocked && (
                              <Badge variant="secondary" className="text-xs">
                                {decoration.unlockPoints} pts
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge className="bg-green-500">Placed</Badge>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="home" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Choose Home Style</CardTitle>
                  <CardDescription className="text-black">Pick a theme for your pet's home!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {homeStyles.map((style) => (
                      <Card
                        key={style.id}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          homeStyle === style.id ? 'border-4 border-blue-500' : 'border-2'
                        }`}
                        onClick={() => setHomeStyle(style.id)}
                      >
                        <CardContent className="p-6 text-center space-y-3">
                          <div className={`h-24 rounded-lg bg-gradient-to-br ${style.color}`}></div>
                          <p className="font-bold text-black">{style.name}</p>
                          {homeStyle === style.id && (
                            <Badge className="bg-blue-500">Selected</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button
            size="lg"
            onClick={handleSaveChanges}
            disabled={savePetHubMutation.isPending}
            className="w-full text-xl py-6"
          >
            {savePetHubMutation.isPending ? 'Saving...' : 'Save Changes 💾'}
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-4 bg-gradient-to-br from-pink-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Heart className="w-6 h-6 text-pink-600" />
                Happiness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {getMoodIcon()}
                <p className="text-2xl font-bold mt-2 text-black">{getMoodText()}</p>
              </div>
              <Progress value={happinessLevel} className="h-4" />
              <p className="text-center text-sm text-black">
                {happinessLevel}% Happy
              </p>
            </CardContent>
          </Card>

          <Card className="border-4 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Growth Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Crown className="w-12 h-12 mx-auto text-yellow-500" />
                <p className="text-2xl font-bold mt-2 text-black">Stage {growthStage}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-black">
                  <span>Progress to Stage {growthStage + 1}</span>
                  <span>{Math.floor((totalPoints % 1000) / 10)}%</span>
                </div>
                <Progress value={(totalPoints % 1000) / 10} className="h-3" />
                <p className="text-xs text-black text-center">
                  {totalPoints} / {growthStage * 1000} points
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Star className="w-6 h-6 text-yellow-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-black">Total Points:</span>
                <span className="font-bold text-black">{totalPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Accessories:</span>
                <span className="font-bold text-black">{selectedAccessories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Decorations:</span>
                <span className="font-bold text-black">{selectedDecorations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Home Style:</span>
                <span className="font-bold text-black">{homeStyle}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Sparkles className="w-6 h-6 text-green-600" />
                Earn More Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('games')}
              >
                🎮 Play Games
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('spin-wheel')}
              >
                🎡 Spin the Wheel
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('learn-hub')}
              >
                📚 Learn Hub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
