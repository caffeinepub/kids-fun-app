import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

type EventType = 'birthday' | 'festival' | 'school' | 'family' | 'custom';

interface Event {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  description: string;
  location?: string;
  attendees: number;
  icon: string;
}

export default function EventsModule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Birthday Party',
      type: 'birthday',
      date: new Date(2025, 0, 15),
      description: 'My 10th birthday celebration!',
      location: 'Home',
      attendees: 15,
      icon: '/assets/generated/birthday-event-icon.dim_64x64.png',
    },
    {
      id: '2',
      title: 'Christmas',
      type: 'festival',
      date: new Date(2025, 11, 25),
      description: 'Christmas celebration with family',
      location: 'Grandma\'s house',
      attendees: 20,
      icon: '/assets/generated/festival-event-icon.dim_64x64.png',
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'birthday' as EventType,
    date: new Date(),
    description: '',
    location: '',
  });

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    const iconMap: Record<EventType, string> = {
      birthday: '/assets/generated/birthday-event-icon.dim_64x64.png',
      festival: '/assets/generated/festival-event-icon.dim_64x64.png',
      school: '/assets/generated/school-event-icon.dim_64x64.png',
      family: '/assets/generated/family-event-icon.dim_64x64.png',
      custom: '/assets/generated/birthday-event-icon.dim_64x64.png',
    };

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      type: newEvent.type,
      date: newEvent.date,
      description: newEvent.description,
      location: newEvent.location,
      attendees: 0,
      icon: iconMap[newEvent.type],
    };

    setEvents([...events, event]);
    toast.success('Event created successfully! 🎉');
    setNewEvent({
      title: '',
      type: 'birthday',
      date: new Date(),
      description: '',
      location: '',
    });
  };

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'birthday':
        return 'bg-pink-500';
      case 'festival':
        return 'bg-purple-500';
      case 'school':
        return 'bg-blue-500';
      case 'family':
        return 'bg-green-500';
      case 'custom':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Events 🎉
        </h1>
        <p className="text-lg text-gray-700">Manage your special occasions and celebrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-4">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-semibold">
                  + Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>Add a new event to your calendar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, type: value as EventType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Event description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Event location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateEvent} className="w-full">
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {events.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">No events yet. Create your first event!</p>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={event.icon} alt={event.type} className="w-12 h-12" />
                        <div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <CardDescription>{event.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{getDaysUntil(event.date)} days</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
