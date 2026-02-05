import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSpinWheel, useGetSpinRewardHistory } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Gift, Clock, Sparkles } from 'lucide-react';

export default function SpinWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canSpin, setCanSpin] = useState(true);

  const spinWheelMutation = useSpinWheel();
  const { data: rewardHistory = [] } = useGetSpinRewardHistory();

  useEffect(() => {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    if (lastSpinTime) {
      const elapsed = Date.now() - parseInt(lastSpinTime);
      const cooldown = 20 * 60 * 1000; // 20 minutes
      if (elapsed < cooldown) {
        setCanSpin(false);
        setTimeRemaining(Math.ceil((cooldown - elapsed) / 1000));
      }
    }
  }, []);

  useEffect(() => {
    if (!canSpin && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCanSpin(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [canSpin, timeRemaining]);

  const handleSpin = async () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    const spins = 5 + Math.random() * 3;
    const newRotation = rotation + 360 * spins + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(async () => {
      try {
        const result = await spinWheelMutation.mutateAsync();
        
        let message = '';
        let description = '';
        
        if (result.extraSpin) {
          message = '🎁 Mystery Box! You won an extra spin!';
          description = 'Spin again immediately!';
          toast.success(message, { description });
          setIsSpinning(false);
          return; // Don't set cooldown for mystery box
        }
        
        if (result.pointsAwarded > 0) {
          message = `🎉 You won ${result.pointsAwarded} points!`;
          description = 'Your virtual pet is growing!';
        }
        
        if (result.badgesEarned.length > 0) {
          const badgeNames = result.badgesEarned.map(b => b.badge.name).join(', ');
          if (message) {
            message += ` Plus ${result.badgesEarned.length} badge(s): ${badgeNames}!`;
          } else {
            message = `🏆 You won ${result.badgesEarned.length} badge(s): ${badgeNames}!`;
          }
        }
        
        toast.success(message, { description });
        
        localStorage.setItem('lastSpinTime', Date.now().toString());
        setCanSpin(false);
        setTimeRemaining(20 * 60);
      } catch (error: any) {
        if (error.message && error.message.includes('cannot be spun yet')) {
          toast.error('Please wait for the cooldown to finish!');
        } else {
          toast.error('Unable to spin the wheel. Please try again later.');
        }
      } finally {
        setIsSpinning(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const prizes = [
    { label: 'Points 100', color: 'from-blue-400 to-blue-600' },
    { label: 'Badge', color: 'from-yellow-400 to-yellow-600' },
    { label: 'Points 250', color: 'from-green-400 to-green-600' },
    { label: 'Mystery Box', color: 'from-purple-400 to-purple-600' },
    { label: 'Points 500', color: 'from-orange-400 to-orange-600' },
    { label: 'Badge', color: 'from-pink-400 to-pink-600' },
    { label: 'Points 100', color: 'from-teal-400 to-teal-600' },
    { label: 'Mystery Box', color: 'from-red-400 to-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Spin the Wheel! 🎡
        </h1>
        <p className="text-lg text-black">Spin every 20 minutes for points and badges!</p>
        <p className="text-sm text-black mt-1">Points you earn help your virtual pet grow! 🐶</p>
        <p className="text-xs text-black mt-1">Land on Mystery Box for an extra spin!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Prize Wheel
            </CardTitle>
            <CardDescription className="text-black">Click the button to spin and win!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <div
                className="absolute inset-0 rounded-full border-8 border-yellow-400 shadow-2xl overflow-hidden"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index;
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 bg-gradient-to-br ${prize.color}`}
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 22.5) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 22.5) * Math.PI / 180)}%, ${50 + 50 * Math.cos((angle + 22.5) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + 22.5) * Math.PI / 180)}%)`,
                      }}
                    >
                      <div
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 text-white font-bold text-xs md:text-sm"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-20px)`,
                        }}
                      >
                        {prize.label}
                      </div>
                    </div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-yellow-400 shadow-lg"></div>
                </div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 z-10"></div>
            </div>

            <div className="text-center space-y-4">
              {canSpin ? (
                <Button
                  size="lg"
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="text-xl px-8 py-6 font-bold"
                >
                  {isSpinning ? 'Spinning...' : 'Spin Now! 🎯'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-lg px-4 py-2 text-black">
                    <Clock className="w-4 h-4 mr-2" />
                    Next spin in: {formatTime(timeRemaining)}
                  </Badge>
                  <p className="text-sm text-black">Come back soon for another spin!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Gift className="w-6 h-6 text-pink-600" />
              Your Prize History
            </CardTitle>
            <CardDescription className="text-black">Recent rewards you've won</CardDescription>
          </CardHeader>
          <CardContent>
            {rewardHistory.length === 0 ? (
              <div className="text-center py-8 text-black">
                <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No prizes yet. Spin the wheel to win!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rewardHistory.map((reward, index) => (
                  <Card key={index} className="border-2 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg text-black">{reward.value}</p>
                        <p className="text-sm text-black">{reward.rewardType}</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Won! ✓</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
