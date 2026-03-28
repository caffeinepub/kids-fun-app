import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetChatMessages,
  useGetOnlineUsers,
  useSendChatMessage,
  useUpdateOnlineStatus,
} from "@/hooks/useQueries";
import { MessageCircle, Send, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function ChatPage() {
  const { identity } = useInternetIdentity();
  const { data: onlineUsers = [] } = useGetOnlineUsers();
  const { data: messages = [] } = useGetChatMessages();
  const sendMessageMutation = useSendChatMessage();
  const updateOnlineStatusMutation = useUpdateOnlineStatus();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = identity?.getPrincipal().toString() || "";

  useEffect(() => {
    if (identity && currentUserId) {
      updateOnlineStatusMutation.mutate({
        userId: currentUserId,
        isOnline: true,
      });
    }

    return () => {
      if (identity && currentUserId) {
        updateOnlineStatusMutation.mutate({
          userId: currentUserId,
          isOnline: false,
        });
      }
    };
  }, [identity, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser || !identity) {
      toast.error("Please select a user and enter a message");
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        recipient: selectedUser,
        content: messageText,
        isGroupChat: false,
      });

      setMessageText("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === currentUserId && msg.recipient === selectedUser) ||
      (msg.sender === selectedUser && msg.recipient === currentUserId),
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Chat & Messages 💬
        </h1>
        <p className="text-xl text-gray-700">Connect with friends safely</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Online Users
            </CardTitle>
            <CardDescription>Select a user to chat</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {onlineUsers
                  .filter((user) => user.userId !== currentUserId)
                  .map((user) => (
                    <Button
                      key={user.userId}
                      variant={
                        selectedUser === user.userId ? "default" : "ghost"
                      }
                      className={`w-full justify-start ${
                        selectedUser === user.userId
                          ? "bg-purple-600 text-white"
                          : ""
                      }`}
                      onClick={() => setSelectedUser(user.userId)}
                    >
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback>
                          {user.userId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">
                          User {user.userId.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                    </Button>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {selectedUser
                ? `Chat with User ${selectedUser.slice(0, 8)}...`
                : "Select a user to start chatting"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                <ScrollArea className="h-[300px] border-2 rounded-lg p-4">
                  <div className="space-y-3">
                    {filteredMessages.length === 0 ? (
                      <p className="text-center text-gray-500">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      filteredMessages.map((message) => {
                        const isOwn = message.sender === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwn
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-200 text-gray-900"
                              }`}
                            >
                              <p className="text-xs font-semibold mb-1">
                                {isOwn
                                  ? "You"
                                  : `User ${message.sender.slice(0, 8)}...`}
                              </p>
                              <p>{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {new Date(
                                  message.timestamp,
                                ).toLocaleTimeString()}
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      sendMessageMutation.isPending || !messageText.trim()
                    }
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p className="text-gray-500">
                  Select a user from the list to start chatting
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
