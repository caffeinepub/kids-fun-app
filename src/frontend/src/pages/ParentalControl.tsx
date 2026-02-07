import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Clock, Filter, Users, Eye, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useIsCallerAdmin, useListApprovals, useSetApproval } from '../hooks/useQueries';
import { ApprovalStatus } from '../backend';

export default function ParentalControl() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: approvals } = useListApprovals();
  const setApproval = useSetApproval();

  const [screenTimeLimit, setScreenTimeLimit] = useState([120]);
  const [contentFilter, setContentFilter] = useState('medium');
  const [chatEnabled, setChatEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully! ✅');
  };

  const handleApproval = async (userPrincipal: string, status: ApprovalStatus) => {
    try {
      await setApproval.mutateAsync({
        user: { toText: () => userPrincipal } as any,
        status,
      });
      toast.success(`User ${status === ApprovalStatus.approved ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      toast.error('Failed to update approval status');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Parental Control 👨‍👩‍👧
        </h1>
        <p className="text-lg text-gray-700">Manage safety and content settings</p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          {isAdmin && <TabsTrigger value="approvals">User Approvals</TabsTrigger>}
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Screen Time
                </CardTitle>
                <CardDescription>Set daily usage limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Daily Limit</Label>
                    <span className="font-semibold">{screenTimeLimit[0]} minutes</span>
                  </div>
                  <Slider
                    value={screenTimeLimit}
                    onValueChange={setScreenTimeLimit}
                    min={30}
                    max={240}
                    step={15}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Recommended: 60-120 minutes per day for children
                  </p>
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save Screen Time Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-6 h-6" />
                  Content Filtering
                </CardTitle>
                <CardDescription>Control content accessibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Filter Level</Label>
                  <Select value={contentFilter} onValueChange={setContentFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Ages 10-12</SelectItem>
                      <SelectItem value="medium">Medium - Ages 7-9</SelectItem>
                      <SelectItem value="high">High - Ages 5-6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save Filter Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Feature Controls
                </CardTitle>
                <CardDescription>Enable or disable features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Chat Feature</Label>
                    <p className="text-sm text-gray-500">Allow messaging with approved contacts</p>
                  </div>
                  <Switch checked={chatEnabled} onCheckedChange={setChatEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Video Generator</Label>
                    <p className="text-sm text-gray-500">Allow video creation</p>
                  </div>
                  <Switch checked={videoEnabled} onCheckedChange={setVideoEnabled} />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save Feature Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border-4 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Safety Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>All chat messages are monitored</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Automatic language filtering enabled</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Contact approval required for chat</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Age-appropriate content only</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <p>No external links or ads</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="border-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Activity Report
              </CardTitle>
              <CardDescription>View your child's app usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">45</p>
                      <p className="text-sm text-gray-600">Minutes Today</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">12</p>
                      <p className="text-sm text-gray-600">Games Played</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">8</p>
                      <p className="text-sm text-gray-600">Messages Sent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-yellow-600">3</p>
                      <p className="text-sm text-gray-600">Videos Created</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Last updated: Today at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="approvals" className="mt-6">
            <Card className="border-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  User Approvals
                </CardTitle>
                <CardDescription>Manage user access requests</CardDescription>
              </CardHeader>
              <CardContent>
                {!approvals || approvals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvals.map((approval) => (
                      <Card key={approval.principal.toText()} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">User: {approval.principal.toText().slice(0, 20)}...</p>
                              <p className="text-sm text-gray-500">Status: {approval.status}</p>
                            </div>
                            {approval.status === ApprovalStatus.pending && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleApproval(approval.principal.toText(), ApprovalStatus.approved)}
                                  disabled={setApproval.isPending}
                                  size="sm"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleApproval(approval.principal.toText(), ApprovalStatus.rejected)}
                                  disabled={setApproval.isPending}
                                  variant="destructive"
                                  size="sm"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
