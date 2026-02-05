import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Youtube, Star, ExternalLink, Play } from 'lucide-react';
import { ModulePage } from '../App';
import { useState } from 'react';

interface VideoHubPageProps {
  onNavigate: (page: ModulePage) => void;
}

interface Channel {
  name: string;
  description: string;
  channelUrl: string;
  embedUrl: string;
  icon: string;
  embedBlocked?: boolean;
  channelHandle?: string;
}

interface AgeCategory {
  title: string;
  ageRange: string;
  description: string;
  color: string;
  channels: Channel[];
}

export default function VideoHubPage({ onNavigate }: VideoHubPageProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const ageCategories: AgeCategory[] = [
    {
      title: 'Toddlers & Babies',
      ageRange: 'Ages 1-4',
      description: 'Gentle nursery rhymes and educational content for little ones',
      color: 'from-pink-400 to-purple-400',
      channels: [
        {
          name: 'Cocomelon',
          description: 'Popular nursery rhymes and kids songs',
          channelUrl: 'https://www.youtube.com/@Cocomelon',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=Cocomelon',
          icon: '🎵',
          channelHandle: '@Cocomelon',
          embedBlocked: true,
        },
        {
          name: 'Little Baby Bum',
          description: 'Classic nursery rhymes with colorful animations',
          channelUrl: 'https://www.youtube.com/@LittleBabyBum',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=LittleBabyBum',
          icon: '👶',
          channelHandle: '@LittleBabyBum',
          embedBlocked: true,
        },
        {
          name: 'Pinkfong',
          description: 'Baby Shark and educational songs',
          channelUrl: 'https://www.youtube.com/@Pinkfong',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=Pinkfong',
          icon: '🦈',
          channelHandle: '@Pinkfong',
          embedBlocked: true,
        },
        {
          name: 'Ms. Rachel',
          description: 'Speech development and learning',
          channelUrl: 'https://www.youtube.com/@msrachelreviews',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=msrachelreviews',
          icon: '👩‍🏫',
          channelHandle: '@msrachelreviews',
          embedBlocked: true,
        },
      ],
    },
    {
      title: 'Preschool',
      ageRange: 'Ages 4-6',
      description: 'Educational videos and fun learning content',
      color: 'from-blue-400 to-cyan-400',
      channels: [
        {
          name: 'Blippi',
          description: 'Fun educational adventures',
          channelUrl: 'https://www.youtube.com/@Blippi',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=Blippi',
          icon: '🎩',
          channelHandle: '@Blippi',
          embedBlocked: true,
        },
        {
          name: 'Sesame Street',
          description: 'Classic educational entertainment',
          channelUrl: 'https://www.youtube.com/@sesamestreet',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=sesamestreet',
          icon: '🐸',
          channelHandle: '@sesamestreet',
          embedBlocked: true,
        },
        {
          name: 'Alphablocks',
          description: 'Learn phonics with fun characters',
          channelUrl: 'https://www.youtube.com/@Alphablocks',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=Alphablocks',
          icon: '🔤',
          channelHandle: '@Alphablocks',
          embedBlocked: true,
        },
        {
          name: 'Busy Beavers',
          description: 'Educational songs and learning',
          channelUrl: 'https://www.youtube.com/@BusyBeavers',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=BusyBeavers',
          icon: '🦫',
          channelHandle: '@BusyBeavers',
          embedBlocked: true,
        },
      ],
    },
    {
      title: 'Elementary School',
      ageRange: 'Ages 6-12',
      description: 'Science, nature, and creative learning content',
      color: 'from-green-400 to-teal-400',
      channels: [
        {
          name: 'National Geographic Kids',
          description: 'Explore nature and wildlife',
          channelUrl: 'https://www.youtube.com/@NationalGeographicKids',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=NationalGeographicKids',
          icon: '🌍',
          channelHandle: '@NationalGeographicKids',
          embedBlocked: true,
        },
        {
          name: 'Khan Academy Kids',
          description: 'Educational lessons and activities',
          channelUrl: 'https://www.youtube.com/@KhanAcademyKids',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=KhanAcademyKids',
          icon: '📚',
          channelHandle: '@KhanAcademyKids',
        },
        {
          name: 'Learn Bright',
          description: 'Educational videos for kids',
          channelUrl: 'https://www.youtube.com/@LearnBright',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=LearnBright',
          icon: '💡',
          channelHandle: '@LearnBright',
          embedBlocked: true,
        },
        {
          name: 'Homeschool Pop',
          description: 'Fun educational content',
          channelUrl: 'https://www.youtube.com/@HomeschoolPop',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=HomeschoolPop',
          icon: '🏫',
          channelHandle: '@HomeschoolPop',
          embedBlocked: true,
        },
        {
          name: 'Bill Nye The Science Guy',
          description: 'Science experiments and learning',
          channelUrl: 'https://www.youtube.com/@billnye',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=billnye',
          icon: '🧪',
          channelHandle: '@billnye',
          embedBlocked: true,
        },
        {
          name: 'BrainPOP',
          description: 'Educational animated videos',
          channelUrl: 'https://www.youtube.com/@BrainPOP',
          embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=BrainPOP',
          icon: '🧠',
          channelHandle: '@BrainPOP',
          embedBlocked: true,
        },
      ],
    },
  ];

  const handleChannelClick = (channel: Channel, categoryTitle: string) => {
    setSelectedChannel(channel);
    setSelectedCategory(categoryTitle);
  };

  const handleBackToCategories = () => {
    setSelectedChannel(null);
    setSelectedCategory(null);
  };

  if (selectedChannel && selectedCategory) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          onClick={handleBackToCategories}
          variant="outline"
          className="border-4 border-neon-purple hover:border-neon-cyan shadow-neon-md hover:shadow-neon-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Channels
        </Button>

        {/* Channel Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">{selectedChannel.icon}</div>
          <h2 className="text-4xl md:text-5xl font-bold text-neon-pink text-shadow-neon-lg">
            {selectedChannel.name}
          </h2>
          <p className="text-xl text-neon-cyan text-shadow-neon-md">
            {selectedChannel.description}
          </p>
          <div className="inline-block px-4 py-2 bg-neon-purple/20 border-2 border-neon-purple rounded-full">
            <p className="text-lg font-semibold text-neon-purple">
              {selectedCategory}
            </p>
          </div>
        </div>

        {/* Channel Content */}
        <Card className="border-4 border-neon-purple shadow-neon-lg bg-gradient-to-br from-white to-purple-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Channel Preview with Attribution */}
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-neon-md bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                <div className="text-center p-8 space-y-4 z-10">
                  <div className="text-6xl mb-4">{selectedChannel.icon}</div>
                  <Youtube className="w-16 h-16 text-red-500 mx-auto" />
                  <h3 className="text-2xl font-bold text-purple-900">
                    {selectedChannel.name}
                  </h3>
                  <p className="text-lg text-purple-700 max-w-md mx-auto">
                    {selectedChannel.embedBlocked 
                      ? "This channel's videos are available on YouTube. Click below to watch!"
                      : "Watch amazing videos from this channel on YouTube!"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <a
                      href={selectedChannel.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-neon-lg hover:shadow-neon-xl transition-all text-lg px-8 py-4">
                        <Youtube className="w-6 h-6 mr-2" />
                        Watch on YouTube
                        <ExternalLink className="w-5 h-5 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Attribution Notice */}
              <div className="p-4 bg-blue-100 border-2 border-blue-400 rounded-lg">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-blue-900 font-semibold">
                      © {selectedChannel.name}, YouTube
                    </p>
                    <p className="text-xs text-blue-800">
                      All videos are the property of {selectedChannel.name}. Content is safe, educational, and kid-friendly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Safe Viewing Notice */}
              <div className="p-4 bg-green-100 border-2 border-green-400 rounded-lg">
                <div className="flex items-start gap-3">
                  <Play className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-green-900 font-semibold">
                      Safe Viewing Experience
                    </p>
                    <p className="text-xs text-green-800">
                      When you visit YouTube, you'll see videos from this trusted educational channel. Parental supervision is recommended.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Channel Info */}
        <Card className="border-4 border-neon-cyan shadow-neon-md bg-gradient-to-br from-white to-cyan-50">
          <CardHeader>
            <CardTitle className="text-2xl text-cyan-900 flex items-center gap-2">
              <Youtube className="w-6 h-6 text-red-500" />
              About This Channel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p className="text-cyan-900">
                <strong>Age-Appropriate:</strong> Content is suitable for {selectedCategory}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p className="text-cyan-900">
                <strong>Educational:</strong> {selectedChannel.description}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p className="text-cyan-900">
                <strong>Trusted Source:</strong> Verified educational content creator
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p className="text-cyan-900">
                <strong>Safe for Kids:</strong> Family-friendly videos with no inappropriate content
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        onClick={() => onNavigate('dashboard')}
        variant="outline"
        className="border-4 border-neon-purple hover:border-neon-cyan shadow-neon-md hover:shadow-neon-lg transition-all"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4 animate-neon-pulse">📺</div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent text-shadow-neon-lg">
          Kids YouTube Videos Hub
        </h1>
        <p className="text-xl md:text-2xl text-neon-green text-shadow-neon-md">
          Safe, educational, and fun videos for every age!
        </p>
      </div>

      {/* Age Categories */}
      <div className="space-y-8">
        {ageCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${category.color} p-6 rounded-2xl border-4 border-white shadow-neon-lg`}>
              <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-neon-lg mb-2">
                {category.title}
              </h2>
              <p className="text-xl text-white/90 font-semibold mb-1">
                {category.ageRange}
              </p>
              <p className="text-lg text-white/80">
                {category.description}
              </p>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.channels.map((channel) => (
                <Card
                  key={channel.name}
                  className="border-4 border-neon-purple hover:border-neon-cyan hover:shadow-neon-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-white to-purple-50"
                  onClick={() => handleChannelClick(channel, category.title)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-4xl">{channel.icon}</div>
                      <Youtube className="w-6 h-6 text-red-500" />
                    </div>
                    <CardTitle className="text-lg text-purple-900 leading-tight">
                      {channel.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-purple-700">
                      {channel.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice */}
      <Card className="border-4 border-yellow-400 bg-yellow-50 shadow-neon-md">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-900 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Safe Viewing Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-yellow-900">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>All channels are kid-friendly and educational</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Content is age-appropriate for each category</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Trusted educational content creators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Videos open on YouTube with proper attribution</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Parental supervision recommended for younger children</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>All content © respective channel owners on YouTube</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
