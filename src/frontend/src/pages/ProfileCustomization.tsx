import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Palette, Image as ImageIcon, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Principal } from '@icp-sdk/core/principal';

export default function ProfileCustomization() {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState(userProfile?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState('😊');
  const [selectedTheme, setSelectedTheme] = useState('purple');

  const avatars = [
    '😊', '😄', '😎', '🤓', '🥳', '🤩',
    '🦁', '🐯', '🐻', '🐼', '🐨', '🐸',
    '🦄', '🐉', '🦋', '🌟', '⭐', '🌈',
  ];

  const themes = [
    { id: 'purple', name: 'Purple Dream', color: 'from-purple-400 to-pink-400' },
    { id: 'blue', name: 'Ocean Blue', color: 'from-blue-400 to-cyan-400' },
    { id: 'green', name: 'Forest Green', color: 'from-green-400 to-teal-400' },
    { id: 'orange', name: 'Sunset Orange', color: 'from-orange-400 to-red-400' },
    { id: 'rainbow', name: 'Rainbow', color: 'from-red-400 via-yellow-400 to-blue-400' },
    { id: 'galaxy', name: 'Galaxy', color: 'from-indigo-400 via-purple-400 to-pink-400' },
  ];

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!userProfile) {
      toast.error('Profile not loaded');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        ...userProfile,
        name: name.trim(),
      });
      toast.success('Profile updated successfully! ✨');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Profile Customization 👤
        </h1>
        <p className="text-lg text-gray-700">Personalize your profile and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-4">
          <CardHeader className="text-center">
            <CardTitle>Profile Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                <AvatarFallback className="text-6xl bg-gradient-to-br from-purple-100 to-pink-100">
                  {selectedAvatar}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{name || 'Your Name'}</h2>
              <p className="text-gray-500">Age: {userProfile?.age.toString() || 'N/A'}</p>
            </div>
            <div className={`h-24 bg-gradient-to-r ${themes.find(t => t.id === selectedTheme)?.color} rounded-lg border-4 border-white shadow-lg`}></div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <Card className="border-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      value={userProfile?.age.toString() || ''}
                      disabled
                      className="text-lg h-12"
                    />
                    <p className="text-sm text-gray-500">Age cannot be changed</p>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saveProfile.isPending} className="w-full text-lg h-12 font-bold">
                    {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avatar" className="mt-6">
              <Card className="border-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-6 h-6" />
                    Choose Your Avatar
                  </CardTitle>
                  <CardDescription>Select an avatar that represents you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-4">
                    {avatars.map((avatar, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer hover:shadow-lg transition-all ${
                          selectedAvatar === avatar ? 'border-4 border-primary scale-110' : 'border-2'
                        }`}
                        onClick={() => setSelectedAvatar(avatar)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-4xl">{avatar}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="mt-6">
              <Card className="border-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-6 h-6" />
                    Profile Theme
                  </CardTitle>
                  <CardDescription>Choose your favorite color theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <Card
                        key={theme.id}
                        className={`cursor-pointer hover:shadow-lg transition-all ${
                          selectedTheme === theme.id ? 'border-4 border-primary' : 'border-2'
                        }`}
                        onClick={() => setSelectedTheme(theme.id)}
                      >
                        <CardContent className="p-4">
                          <div className={`h-20 bg-gradient-to-r ${theme.color} rounded-lg mb-2`}></div>
                          <p className="font-semibold text-center">{theme.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-4 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {['🏆', '⭐', '🎮', '🎨', '💬', '🎉', '😄', '🎬'].map((emoji, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-2">{emoji}</div>
                    <p className="text-xs text-gray-600">Badge {index + 1}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
