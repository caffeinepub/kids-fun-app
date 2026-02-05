import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Users, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetOnlineUsers, useSendChatMessage, useGetChatMessages, useUpdateOnlineStatus, OnlineUser, ChatMessage } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Principal } from '@icp-sdk/core/principal';

export default function ChatPage() {
  const { identity } = useInternetIdentity();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: onlineUsers = [], refetch: refetchOnlineUsers } = useGetOnlineUsers();
  const { data: messages = [], refetch: refetchMessages } = useGetChatMessages(selectedUser);
  const sendMessageMutation = useSendChatMessage();
  const updateStatusMutation = useUpdateOnlineStatus();

  // Update online status on mount and unmount
  useEffect(() => {
    if (identity) {
      updateStatusMutation.mutate(true);
    }

    return () => {
      if (identity) {
        updateStatusMutation.mutate(false);
      }
    };
  }, [identity]);

  // Poll for online users and messages
  useEffect(() => {
    const interval = setInterval(() => {
      refetchOnlineUsers();
      if (selectedUser) {
        refetchMessages();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser, refetchOnlineUsers, refetchMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser || !identity) {
      return;
    }

    const recipientPrincipal = Principal.fromText(selectedUser);
    const senderPrincipal = identity.getPrincipal();

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      sender: senderPrincipal,
      recipient: recipientPrincipal,
      content: messageText,
      timestamp: BigInt(Date.now()),
      isGroupChat: false,
      groupId: undefined,
    };

    try {
      await sendMessageMutation.mutateAsync(newMessage);
      setMessageText('');
      toast.success('Message sent! 📨');
      refetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedUserData = onlineUsers.find(u => u.userId.toText() === selectedUser);
  const currentUserId = identity?.getPrincipal().toText();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-green bg-clip-text text-transparent">
          Real-Time Chat 💬
        </h1>
        <p className="text-lg text-gray-200">Chat with online users instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Online Users List */}
        <Card className="border-4 border-neon-cyan lg:col-span-1 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm shadow-neon-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-cyan">
              <Users className="w-5 h-5" />
              Online Users ({onlineUsers.length})
            </CardTitle>
            <CardDescription className="text-gray-300">Currently active users</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {onlineUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No users online</p>
                  </div>
                ) : (
                  onlineUsers
                    .filter(user => user.userId.toText() !== currentUserId)
                    .map((user) => (
                      <Button
                        key={user.userId.toText()}
                        variant={selectedUser === user.userId.toText() ? 'default' : 'ghost'}
                        className={`w-full justify-start gap-3 h-auto py-3 ${
                          selectedUser === user.userId.toText()
                            ? 'bg-neon-cyan text-black shadow-neon-sm'
                            : 'text-gray-200 hover:bg-purple-800/50 hover:text-neon-cyan'
                        }`}
                        onClick={() => setSelectedUser(user.userId.toText())}
                      >
                        <Avatar className="border-2 border-neon-green">
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-neon-pink to-neon-purple text-white">
                            {user.userId.toText().slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="font-semibold">User {user.userId.toText().slice(0, 8)}...</p>
                          <p className="text-xs flex items-center gap-1">
                            <Circle className="w-2 h-2 fill-neon-green text-neon-green" />
                            Online
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-neon-green text-black">
                          ●
                        </Badge>
                      </Button>
                    ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="border-4 border-neon-pink lg:col-span-2 bg-gradient-to-br from-purple-900/50 to-violet-900/50 backdrop-blur-sm shadow-neon-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-pink">
              <MessageCircle className="w-5 h-5" />
              {selectedUserData ? `Chat with User ${selectedUser?.slice(0, 8)}...` : 'Select a user to chat'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                <ScrollArea className="h-[400px] border-4 border-neon-purple rounded-lg p-4 bg-black/30 backdrop-blur-sm">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.sender.toText() === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwn
                                  ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-black shadow-neon-sm'
                                  : 'bg-gradient-to-r from-neon-pink to-neon-purple text-white border-2 border-neon-pink shadow-neon-sm'
                              }`}
                            >
                              <p className="font-semibold text-sm mb-1">
                                {isOwn ? 'You' : `User ${message.sender.toText().slice(0, 8)}...`}
                              </p>
                              <p className="break-words">{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {new Date(Number(message.timestamp)).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border-2 border-neon-cyan bg-black/30 text-white placeholder:text-gray-400 focus:border-neon-green focus:ring-neon-green"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink shadow-neon-sm"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-neon-cyan opacity-50" />
                  <p className="text-lg">Select an online user to start chatting</p>
                  <p className="text-sm mt-2">Messages are delivered instantly!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
