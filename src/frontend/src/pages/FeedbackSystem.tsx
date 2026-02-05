import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Smile, Meh, Frown, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

type FeedbackType = 'bug' | 'feature' | 'general' | 'safety' | 'parent';
type SatisfactionLevel = 'happy' | 'neutral' | 'sad' | null;

export default function FeedbackSystem() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [satisfaction, setSatisfaction] = useState<SatisfactionLevel>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    toast.success('Thank you for your feedback! 🎉');
    
    // Reset form
    setTitle('');
    setDescription('');
    setSatisfaction(null);
    setIsAnonymous(false);
  };

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', emoji: '🐛', description: 'Report a problem or error' },
    { value: 'feature', label: 'Feature Request', emoji: '💡', description: 'Suggest a new feature' },
    { value: 'general', label: 'General Feedback', emoji: '💬', description: 'Share your thoughts' },
    { value: 'safety', label: 'Safety Concern', emoji: '🛡️', description: 'Report safety issues' },
    { value: 'parent', label: 'Parent Feedback', emoji: '👨‍👩‍👧', description: 'Feedback from parents' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Feedback 💬
        </h1>
        <p className="text-lg text-gray-700">Share your thoughts and help us improve</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-4">
          <CardHeader>
            <CardTitle className="text-2xl">Submit Feedback</CardTitle>
            <CardDescription>We'd love to hear from you!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>How are you feeling about the app?</Label>
                <div className="flex gap-4 justify-center py-4">
                  <button
                    type="button"
                    onClick={() => setSatisfaction('happy')}
                    className={`p-4 rounded-full transition-all ${
                      satisfaction === 'happy'
                        ? 'bg-green-500 text-white scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Smile className="w-12 h-12" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSatisfaction('neutral')}
                    className={`p-4 rounded-full transition-all ${
                      satisfaction === 'neutral'
                        ? 'bg-yellow-500 text-white scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Meh className="w-12 h-12" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSatisfaction('sad')}
                    className={`p-4 rounded-full transition-all ${
                      satisfaction === 'sad'
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Frown className="w-12 h-12" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Feedback Type</Label>
                <Select value={feedbackType} onValueChange={(value) => setFeedbackType(value as FeedbackType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.emoji} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your feedback"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about your feedback..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Submit anonymously
                </Label>
              </div>

              <Button type="submit" className="w-full text-lg h-12 font-bold">
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-4">
            <CardHeader>
              <CardTitle>Feedback Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feedbackTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all ${
                    feedbackType === type.value ? 'border-2 border-primary' : 'border'
                  }`}
                  onClick={() => setFeedbackType(type.value as FeedbackType)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{type.emoji}</span>
                      <div>
                        <p className="font-semibold">{type.label}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className="border-4 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Why Feedback Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✨ Your feedback helps us make the app better</p>
              <p>🎯 We read every submission carefully</p>
              <p>🚀 Many features come from user suggestions</p>
              <p>🛡️ Safety concerns are our top priority</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
