import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetMyFeedback, useSubmitFeedback, FeedbackType } from '../hooks/useQueries';

export default function FeedbackPage() {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.generalFeedback);
  
  const { data: myFeedback } = useGetMyFeedback();
  const submitFeedback = useSubmitFeedback();

  const feedbackTypes = [
    { value: FeedbackType.generalFeedback, label: 'General Feedback', emoji: '💬' },
    { value: FeedbackType.bugReport, label: 'Bug Report', emoji: '🐛' },
    { value: FeedbackType.featureRequest, label: 'Feature Request', emoji: '💡' },
    { value: FeedbackType.safetyConcern, label: 'Safety Concern', emoji: '🛡️' },
    { value: FeedbackType.parentFeedback, label: 'Parent Feedback', emoji: '👨‍👩‍👧' },
  ];

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      toast.error('Please write your feedback');
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        feedbackType,
        text: feedbackText,
      });
      toast.success('Feedback submitted! Thank you! 🎉');
      setFeedbackText('');
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Feedback System 📝
        </h1>
        <p className="text-lg text-gray-700">Help us make the app better!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-6 h-6" />
              Submit Feedback
            </CardTitle>
            <CardDescription>
              Tell us what you think or report any issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback Type</label>
              <Select
                value={feedbackType}
                onValueChange={(value) => setFeedbackType(value as FeedbackType)}
              >
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
              <label className="text-sm font-medium">Your Feedback</label>
              <Textarea
                placeholder="Tell us what you think..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={8}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitFeedback.isPending}
              size="lg"
              className="w-full gap-2"
            >
              <Send className="w-5 h-5" />
              {submitFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              My Feedback History
            </CardTitle>
            <CardDescription>View your previous feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {myFeedback && myFeedback.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {myFeedback.map((feedback) => (
                  <Card key={feedback.id.toString()} className="border-2">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {feedbackTypes.find(t => t.value === feedback.feedbackType)?.emoji}{' '}
                          {feedbackTypes.find(t => t.value === feedback.feedbackType)?.label}
                        </Badge>
                        {feedback.isResolved ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                      <p className="text-sm">{feedback.text}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Number(feedback.timestamp) / 1000000).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No feedback submitted yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>Why Your Feedback Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">✓</span>
            <p>Help us fix bugs and improve the app</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">✓</span>
            <p>Suggest new games and features you'd like to see</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">✓</span>
            <p>Report any safety concerns immediately</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">✓</span>
            <p>Parents can share their thoughts too!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
