import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Users, Activity, AlertTriangle, Settings, Search, Ban, Lock, Unlock, UserX, TrendingUp, FileText, Download, Eye, Edit, Trash2, CheckCircle, XCircle, BarChart3, PieChart, LineChart, Bell, Clock, Database, Gamepad2, UserPlus } from 'lucide-react';
import { useGetAdminDashboard, useSetUserStatus, useAddRestriction, useRemoveRestriction, useIsCallerAdmin, useGetRecentActivityEvents, AdminUserStatus, type ActivityEvent } from '../hooks/useQueries';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';
import React from 'react';

export default function AdminDashboardPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: dashboardData, isLoading: dashboardLoading } = useGetAdminDashboard();
  const { data: activityEvents = [], isLoading: activityLoading } = useGetRecentActivityEvents(50);
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
        reason: statusChangeReason,
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

  const formatActivityEvent = (event: ActivityEvent): { description: string; user: string; time: string; type: string } => {
    const timestamp = Number(event.timestamp) / 1_000_000; // Convert nanoseconds to milliseconds
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

    const userPrincipal = event.userId.toText();
    const shortUser = `${userPrincipal.slice(0, 8)}...${userPrincipal.slice(-4)}`;

    if (event.activityType.__kind__ === 'user_created') {
      return {
        description: 'User registered',
        user: shortUser,
        time: timeStr,
        type: 'success',
      };
    } else if (event.activityType.__kind__ === 'game_played') {
      const gameName = event.activityType.game_played.gameName;
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
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-12 h-12 text-neon-purple animate-neon-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent text-shadow-neon-lg">
            Admin Control Panel
          </h1>
        </div>
        <p className="text-xl text-foreground/80">Complete website management and monitoring</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
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
                variant={selectedTab === 'content' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedTab === 'content' ? 'bg-neon-green text-white' : 'border-neon-green text-neon-green hover:bg-neon-green hover:text-white'}`}
                onClick={() => setSelectedTab('content')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Content Management
              </Button>
              <Button
                variant={selectedTab === 'moderation' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedTab === 'moderation' ? 'bg-neon-orange text-white' : 'border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-white'}`}
                onClick={() => setSelectedTab('moderation')}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Moderation
              </Button>
              <Button
                variant={selectedTab === 'analytics' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedTab === 'analytics' ? 'bg-neon-pink text-white' : 'border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white'}`}
                onClick={() => setSelectedTab('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button
                variant={selectedTab === 'settings' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedTab === 'settings' ? 'bg-neon-purple text-white' : 'border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white'}`}
                onClick={() => setSelectedTab('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Dashboard Overview */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
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
                      {activityEvents.filter(e => e.activityType.__kind__ === 'game_played').length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Total sessions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
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
                                  {event.activityType.__kind__ === 'user_created' ? (
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

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-4 border-neon-purple shadow-neon-purple rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-neon-purple flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Safety Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Pending Reports</span>
                        <Badge className="bg-red-500 text-white">3</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Resolved Today</span>
                        <Badge className="bg-green-500 text-white">12</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-neon-green shadow-neon-green rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-neon-green flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Server Health</span>
                        <Badge className="bg-green-500 text-white">Excellent</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Database</span>
                        <Badge className="bg-green-500 text-white">Online</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* User Management */}
          {selectedTab === 'users' && (
            <Card className="border-4 border-neon-cyan shadow-neon-cyan rounded-3xl">
              <CardHeader>
                <CardTitle className="text-neon-cyan flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>View, edit, and manage all user accounts</CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md border-2 border-neon-cyan rounded-xl"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{Number(user.age)}</TableCell>
                          <TableCell>{getStatusBadge(AdminUserStatus.active)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" className="border-neon-cyan text-neon-cyan">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Details</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" className="border-neon-orange text-neon-orange">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit User</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Content Management */}
          {selectedTab === 'content' && (
            <Card className="border-4 border-neon-green shadow-neon-green rounded-3xl">
              <CardHeader>
                <CardTitle className="text-neon-green flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content Management
                </CardTitle>
                <CardDescription>Manage user-generated content and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Content management tools</p>
                  <p className="text-sm text-muted-foreground mt-2">Review and moderate user submissions</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Moderation */}
          {selectedTab === 'moderation' && (
            <Card className="border-4 border-neon-orange shadow-neon-orange rounded-3xl">
              <CardHeader>
                <CardTitle className="text-neon-orange flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Moderation Queue
                </CardTitle>
                <CardDescription>Review flagged content and safety reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No pending moderation items</p>
                  <p className="text-sm text-muted-foreground mt-2">All content has been reviewed</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics */}
          {selectedTab === 'analytics' && (
            <Card className="border-4 border-neon-pink shadow-neon-pink rounded-3xl">
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics & Insights
                </CardTitle>
                <CardDescription>View detailed statistics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Analytics dashboard</p>
                  <p className="text-sm text-muted-foreground mt-2">Detailed charts and reports coming soon</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings */}
          {selectedTab === 'settings' && (
            <Card className="border-4 border-neon-purple shadow-neon-purple rounded-3xl">
              <CardHeader>
                <CardTitle className="text-neon-purple flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">New User Registrations</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Content Moderation</Label>
                        <p className="text-sm text-muted-foreground">Require approval for user content</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
