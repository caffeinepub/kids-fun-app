import { ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { ModulePage } from '../App';
import { useGetUserTrophies, useUpdateGamesTrophies } from '../hooks/useQueries';
import { triggerAchievementCelebration } from './AchievementCelebration';
import { showEmotionFeedback } from './EmotionFeedback';

interface GameLayoutProps {
  title: string;
  children: ReactNode;
  score: number;
  highScore: number;
  onRestart: () => void;
  onNavigate: (page: ModulePage) => void;
  gameOver?: boolean;
  showScore?: boolean;
}

export default function GameLayout({
  title,
  children,
  score,
  highScore,
  onRestart,
  onNavigate,
  gameOver = false,
  showScore = true,
}: GameLayoutProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { data: trophies = 70 } = useGetUserTrophies();
  const updateTrophiesMutation = useUpdateGamesTrophies();

  useEffect(() => {
    if (gameOver && score > highScore) {
      toast.success('🎉 New High Score!', {
        description: `You scored ${score} points!`,
      });
    }
  }, [gameOver, score, highScore]);

  const handleUpgradePet = async () => {
    if (trophies < 2) {
      toast.error('Not enough trophies! You need 2 trophies to upgrade your pet.');
      return;
    }

    try {
      const newTrophies = await updateTrophiesMutation.mutateAsync();
      toast.success(`🏆 Pet Upgraded! You now have ${newTrophies} trophies remaining.`);
      showEmotionFeedback('Your pet is so happy! 🐾');
      triggerAchievementCelebration('Pet Upgraded!', 'confetti');
      setShowUpgradeDialog(false);
    } catch (error: any) {
      if (error.message && error.message.includes('Not enough trophies')) {
        toast.error('Not enough trophies to upgrade your pet!');
      } else {
        toast.error('Failed to upgrade pet. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <Card className="border-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onNavigate('games')}
                  className="border-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                {showScore && (
                  <>
                    <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg border-3 border-yellow-300">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold text-lg">Score: {score}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg border-3 border-purple-300">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-lg">Best: {highScore}</span>
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg border-3 border-orange-300">
                  <Trophy className="w-5 h-5 text-orange-600" />
                  <span className="font-bold text-lg">{trophies} 🏆</span>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="border-3"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRestart}
                  className="border-3"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Game Content */}
        <Card className="border-4">
          <CardContent className="p-0">
            {children}
          </CardContent>
        </Card>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="border-4 max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  {score > highScore ? '🎉 New High Score! 🎉' : 'Game Over!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-purple-600">{score}</div>
                  <div className="text-gray-600">Your Score</div>
                  {highScore > 0 && (
                    <div className="text-sm text-gray-500">Previous Best: {highScore}</div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={onRestart}
                    className="flex-1 text-lg h-12 font-bold"
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setShowUpgradeDialog(true)}
                    variant="outline"
                    className="flex-1 text-lg h-12 font-bold border-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Upgrade Pet
                  </Button>
                </div>
                
                <Button
                  onClick={() => onNavigate('games')}
                  variant="outline"
                  className="w-full text-lg h-12 font-bold border-3"
                >
                  Games Hub
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upgrade Pet Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent className="sm:max-w-md border-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Upgrade Pet or Get Trophies
              </DialogTitle>
              <DialogDescription className="text-base">
                Use your trophies to upgrade your virtual pet and help it grow!
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-3 border-purple-300">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🐾</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-6 h-6 text-orange-600" />
                      <span className="text-2xl font-bold">{trophies} Trophies</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Each game costs 2 trophies to play
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-bold">Upgrade Cost:</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">2 🏆</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="font-bold">Benefits:</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">Pet Growth & Happiness</span>
                </div>
              </div>

              {trophies < 2 && (
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                  <p className="text-sm text-yellow-800 text-center font-bold">
                    ⚠️ Not enough trophies! Play more games or visit the Virtual Pet Hub to earn more.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                onClick={handleUpgradePet}
                disabled={trophies < 2 || updateTrophiesMutation.isPending}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
              >
                {updateTrophiesMutation.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade Pet (2 🏆)
                  </>
                )}
              </Button>
              <Button
                onClick={() => onNavigate('virtual-pet-hub')}
                variant="outline"
                className="w-full sm:w-auto border-3"
              >
                Visit Pet Hub
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

