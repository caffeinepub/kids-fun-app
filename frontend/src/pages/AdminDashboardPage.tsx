import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Users, Activity, AlertTriangle, Settings, Ban, Lock, Unlock, TrendingUp, BarChart3, Clock, Gamepad2, UserPlus } from 'lucide-react';
import { useGetAdminDashboard, useSetUserStatus, useAddRestriction, useRemoveRestriction, useIsCallerAdmin, useGetRecentActivityEvents, AdminUserStatus, type ActivityEvent } from '../hooks/useQueries';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';
import React from 'react';

export default function AdminDashboardPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: dashboardData, isLoading: dashboardLoading } = useGetAdminDashboard();
  const { data: activityEvents = [], isLoading: activityLoading } = useGetRecentActivityEvents();
  const setUserStatusMutation = useSetUserStatus();
  const addRestrictionMutation = useAddRestriction();
  const removeRestrictionMutation = useRemoveRestriction();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Principal | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AdminUserStatus>(AdminUserStatus.active);
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [restrictionFeature, setRestrictionFeature] = useState('');
  const [restrictionReason, setRestrictionReason] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  if (isAdminLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-neon-purple mx-auto animate-neon-pulse" />
          <p className="text-2xl font-bold text-neon-pink text-shadow-neon-md">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md border-4 border-neon-pink shadow-neon-pink rounded-3xl">
          <CardHeader className="text-center">
            <Ban className="w-16 h-16 text-neon-pink mx-auto mb-4 animate-neon-pulse" />
            <CardTitle className="text-3xl text-neon-pink text-shadow-neon-lg">Access Denied</CardTitle>
            <CardDescription className="text-lg">
              You do not have permission to access the Admin Dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleStatusChange = async (userId: Principal, newStatus: AdminUserStatus) => {
    if (!statusChangeReason.trim()) {
      toast.error('Please provide a reason for the status change');
      return;
    }

    try {
      await setUserStatusMutation.mutateAsync({
        userId,
        status: newStatus,
      });
      toast.success(`User status updated to ${newStatus}`);
      setStatusChangeReason('');
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const handleAddRestriction = async (userId: Principal) => {
    if (!restrictionFeature.trim() || !restrictionReason.trim()) {
      toast.error('Please provide both feature and reason for restriction');
      return;
    }

    try {
      await addRestrictionMutation.mutateAsync({
        userId,
        feature: restrictionFeature,
        reason: restrictionReason,
      });
      toast.success(`Restriction added for ${restrictionFeature}`);
      setRestrictionFeature('');
      setRestrictionReason('');
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add restriction');
    }
  };

  const handleRemoveRestriction = async (userId: Principal, feature: string) => {
    try {
      await removeRestrictionMutation.mutateAsync({ userId, feature });
      toast.success(`Restriction removed for ${feature}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove restriction');
    }
  };

  const getStatusBadge = (status: AdminUserStatus) => {
    const variants: Record<AdminUserStatus, { color: string; icon: React.ReactElement }> = {
      [AdminUserStatus.active]: { color: 'bg-green-500', icon: <Unlock className="w-3 h-3" /> },
      [AdminUserStatus.restricted]: { color: 'bg-yellow-500', icon: <AlertTriangle className="w-3 h-3" /> },
      [AdminUserStatus.suspended]: { color: 'bg-orange-500', icon: <Lock className="w-3 h-3" /> },
      [AdminUserStatus.banned]: { color: 'bg-red-500', icon: <Ban className="w-3 h-3" /> },
    };

    const variant = variants[status];
    return (
      <Badge className={`${variant.color} text-white flex items-center gap-1`}>
        {variant.icon}
        {status}
      </Badge>
    );
  };

  // Helper to determine activity type from local ActivityEvent shape
  const isUserCreated = (event: ActivityEvent) => event.activityType.user_created !== undefined;
  const isGamePlayed = (event: ActivityEvent) => event.activityType.game_played !== undefined;

  const formatActivityEvent = (event: ActivityEvent): { description: string; user: string; time: string; type: string } => {
    const timestamp = typeof event.timestamp === 'number' ? event.timestamp : Number(event.timestamp) / 1_000_000;
    const now = Date.now();
    const diff = now - timestamp;

    let timeStr = '';
    if (diff < 60000) {
      timeStr = 'Just now';
    } else if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      timeStr = `${mins} minute${mins > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diff / 86400000);
      timeStr = `${days} day${days > 1 ? 's' : ''} ago`;
    }

    // userId is a string in our local ActivityEvent type
    const userId = typeof event.userId === 'string' ? event.userId : String(event.userId);
    const shortUser = userId.length > 12 ? `${userId.slice(0, 8)}...${userId.slice(-4)}` : userId;

    if (isUserCreated(event)) {
      return {
        description: 'User registered',
        user: shortUser,
        time: timeStr,
        type: 'success',
      };
    } else if (isGamePlayed(event)) {
      const gameName = event.activityType.game_played?.gameName ?? 'Unknown';
      return {
        description: `Played game: ${gameName}`,
        user: shortUser,
        time: timeStr,
        type: 'info',
      };
    }

    return {
      description: 'Unknown activity',
      user: shortUser,
      time: timeStr,
      type: 'info',
    };
  };

  const filteredUsers = dashboardData?.manageUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-12 h-12 text-neon-purple animate-neon-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent text-shadow-neon-lg">
            Admin Control Panel
          </h1>
        </div>
        <p className="text-xl text-foreground/80">Complete website management and monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-4 border-neon-purple shadow-neon-purple rounded-3xl sticky top-4">
            <CardHeader>
              <CardTitle className="text-neon-purple flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedTab === 'overview' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedTab === 'overview' ? 'bg-neon-purple text-white' : 'border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white'}`}
                onClick={() => setSelectedTab('overview')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={selectedTab === 'users' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedTab === 'users' ? 'bg-neon-cyan text-white' : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-white'}`}
                onClick={() => setSelectedTab('users')}
              >
                <Users className="w-4 h-4 mr-2" />
                User Management
              </Button>
              <Button
                variant={selectedTab === 'analytics' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedTab === 'analytics' ? 'bg-neon-pink text-white' : 'border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white'}`}
                onClick={() => setSelectedTab('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-4 border-neon-purple shadow-neon-purple rounded-3xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neon-purple flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-neon-pink">{Number(dashboardData?.overview.userStats.total || 0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
                  </CardContent>
                </Card>

                <Card className="border-4 border-neon-green shadow-neon-green rounded-3xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neon-green flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-neon-cyan">{Number(dashboardData?.overview.userStats.active || 0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Currently online</p>
                  </CardContent>
                </Card>

                <Card className="border-4 border-neon-orange shadow-neon-orange rounded-3xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neon-orange flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-neon-orange">{activityEvents.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total events logged</p>
                  </CardContent>
                </Card>

                <Card className="border-4 border-neon-pink shadow-neon-pink rounded-3xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-neon-pink flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4" />
                      Games Played
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-neon-purple">
                      {activityEvents.filter(e => isGamePlayed(e)).length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Total sessions</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-4 border-neon-cyan shadow-neon-cyan rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-neon-cyan flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity Log
                    {activityLoading && <span className="text-xs text-muted-foreground ml-2">(Updating...)</span>}
                  </CardTitle>
                  <CardDescription>Latest user registrations and game activity (auto-updates every 5 seconds)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {activityEvents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[250px] text-center">
                        <Activity className="w-12 h-12 text-muted-foreground mb-3" />
                        <p className="text-lg font-medium text-muted-foreground">No activity yet</p>
                        <p className="text-sm text-muted-foreground mt-1">User registrations and game plays will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activityEvents.slice().reverse().map((event, index) => {
                          const formatted = formatActivityEvent(event);
                          return (
                            <div key={`${event.id}-${index}`} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border-2 border-neon-purple/30">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  formatted.type === 'success' ? 'bg-green-500' :
                                  formatted.type === 'warning' ? 'bg-yellow-500' :
                                  formatted.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                                }`} />
                                <div className="flex items-center gap-2">
                                  {isUserCreated(event) ? (
                                    <UserPlus className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Gamepad2 className="w-4 h-4 text-blue-500" />
                                  )}
                                  <div>
                                    <p className="font-medium">{formatted.description}</p>
                                    <p className="text-sm text-muted-foreground">{formatted.user}</p>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">{formatted.time}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'users' && (
            <Card className="border-4 border-neon-cyan shadow-neon-cyan rounded-3xl">
              <CardHeader>
                <CardTitle className="text-neon-cyan">User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    {filteredUsers.length} user(s) found
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'analytics' && (
            <Card className="border-4 border-neon-pink shadow-neon-pink rounded-3xl">
              <CardHeader>
                <CardTitle className="text-neon-pink">Analytics Dashboard</CardTitle>
                <CardDescription>View platform statistics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">Analytics coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
