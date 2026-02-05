import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Smile, Image as ImageIcon, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
}

export default function ChatModule() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Emma',
      content: 'Hi! Want to play a game?',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
    },
    {
      id: '2',
      sender: 'You',
      content: 'Sure! Which game?',
      timestamp: new Date(Date.now() - 240000),
      isOwn: true,
    },
    {
      id: '3',
      sender: 'Emma',
      content: 'How about Puzzle Master? 🧩',
      timestamp: new Date(Date.now() - 180000),
      isOwn: false,
    },
  ]);

  const contacts: Contact[] = [
    { id: '1', name: 'Emma', avatar: '👧', online: true, lastMessage: 'How about Puzzle Master?' },
    { id: '2', name: 'Alex', avatar: '👦', online: true, lastMessage: 'See you tomorrow!' },
    { id: '3', name: 'Sophie', avatar: '👧', online: false, lastMessage: 'That was fun!' },
    { id: '4', name: 'Max', avatar: '👦', online: false, lastMessage: 'Great game!' },
  ];

  const emojis = ['😊', '😄', '😍', '🎉', '👍', '❤️', '🎮', '🎨', '⭐', '🌈'];

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: messageText,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Chat 💬
        </h1>
        <p className="text-lg text-gray-700">Chat safely with approved friends</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-600 font-semibold">Parent-monitored and safe</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        <Card className="lg:col-span-1 border-4">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>Your approved friends</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              <div className="space-y-2 p-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedContact?.id === contact.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="text-2xl">{contact.avatar}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{contact.name}</p>
                        <p className="text-sm opacity-75 truncate">{contact.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-4 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="text-2xl">{selectedContact.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedContact.name}</CardTitle>
                    <CardDescription>
                      {selectedContact.online ? (
                        <Badge className="bg-green-500">Online</Badge>
                      ) : (
                        <Badge variant="secondary">Offline</Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent'
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">{message.sender}</p>
                          <p>{message.content}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t p-4 space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessageText(messageText + emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-xl font-semibold mb-2">Select a contact to start chatting</p>
                <p>Choose a friend from the list to begin</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
