import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Award, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  points: number;
}

export default function RewardsAchievements() {
  const totalPoints = 2450;
  const level = 8;
  const nextLevelPoints = 3000;

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first game',
      icon: '🎮',
      progress: 1,
      total: 1,
      unlocked: true,
      points: 100,
    },
    {
      id: '2',
      name: 'Social Butterfly',
      description: 'Send 10 messages to friends',
      icon: '💬',
      progress: 7,
      total: 10,
      unlocked: false,
      points: 150,
    },
    {
      id: '3',
      name: 'Creative Mind',
      description: 'Create 5 event cards',
      icon: '🎨',
      progress: 3,
      total: 5,
      unlocked: false,
      points: 200,
    },
    {
      id: '4',
      name: 'Joke Master',
      description: 'Read 50 jokes',
      icon: '😄',
      progress: 50,
      total: 50,
      unlocked: true,
      points: 250,
    },
    {
      id: '5',
      name: 'Event Planner',
      description: 'Create 3 events',
      icon: '🎉',
      progress: 2,
      total: 3,
      unlocked: false,
      points: 150,
    },
    {
      id: '6',
      name: 'Video Star',
      description: 'Create your first video',
      icon: '🎬',
      progress: 1,
      total: 1,
      unlocked: true,
      points: 200,
    },
  ];

  const badges = [
    { id: '1', name: 'Beginner', icon: '🌟', unlocked: true },
    { id: '2', name: 'Explorer', icon: '🗺️', unlocked: true },
    { id: '3', name: 'Creator', icon: '🎨', unlocked: true },
    { id: '4', name: 'Friend', icon: '👥', unlocked: false },
    { id: '5', name: 'Champion', icon: '🏆', unlocked: false },
    { id: '6', name: 'Legend', icon: '⭐', unlocked: false },
  ];

  const challenges = [
    { id: '1', name: 'Daily Login', description: 'Log in today', progress: 1, total: 1, points: 50 },
    { id: '2', name: 'Play 3 Games', description: 'Complete 3 games today', progress: 1, total: 3, points: 100 },
    { id: '3', name: 'Share a Joke', description: 'Share a joke with a friend', progress: 0, total: 1, points: 75 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
          Rewards & Achievements 🏆
        </h1>
        <p className="text-lg text-gray-700">Track your progress and earn rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-4 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-600">{totalPoints}</p>
          </CardContent>
        </Card>

        <Card className="border-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-purple-500" />
              Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600">{level}</p>
          </CardContent>
        </Card>

        <Card className="border-4 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Level Progress
          </CardTitle>
          <CardDescription>
            {nextLevelPoints - totalPoints} points until level {level + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(totalPoints / nextLevelPoints) * 100} className="h-4" />
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`border-2 ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{achievement.icon}</div>
                    {achievement.unlocked ? (
                      <Badge className="bg-green-500">Unlocked</Badge>
                    ) : (
                      <Badge variant="secondary">Locked</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{achievement.name}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{achievement.points} points</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`border-2 ${badge.unlocked ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'opacity-50'}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">{badge.icon}</div>
                  <p className="font-semibold">{badge.name}</p>
                  {badge.unlocked && <Badge className="mt-2 bg-green-500">Earned</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{challenge.name}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">{challenge.points}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {challenge.progress}/{challenge.total}
                    </span>
                  </div>
                  <Progress value={(challenge.progress / challenge.total) * 100} className="h-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
