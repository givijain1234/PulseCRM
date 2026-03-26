import { useState, useEffect, FormEvent } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Plus, 
  Search,
  Filter,
  ChevronRight,
  Video,
  Users2,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { dbService } from '../services/db';
import { Event } from '../types';
import { format } from 'date-fns';
import { serverTimestamp } from 'firebase/firestore';

export default function Events() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'Webinar' as const,
    capacity: 100
  });

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!profile) return;

    const unsubscribe = dbService.subscribeCollection<Event>('events', [], (data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [profile]);

  const now = new Date();
  const upcomingEvents = events.filter(e => e.date.toDate() >= now).sort((a, b) => a.date.toMillis() - b.date.toMillis());
  const pastEvents = events.filter(e => e.date.toDate() < now).sort((a, b) => b.date.toMillis() - a.date.toMillis());

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !newEvent.title || !newEvent.date) return;

    try {
      await dbService.addDocument('events', {
        ...newEvent,
        date: new Date(newEvent.date),
        attendeesCount: 0,
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        location: '',
        type: 'Webinar',
        capacity: 100
      });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleRSVP = async (event: Event) => {
    if (rsvpedEvents.has(event.id)) {
      alert(`You are already RSVP'd for ${event.title}!`);
      return;
    }

    try {
      await dbService.updateDocument('events', event.id, {
        attendeesCount: event.attendeesCount + 1
      });
      setRsvpedEvents(prev => new Set(prev).add(event.id));
      alert(`Successfully RSVP'd for ${event.title}! We've sent the details to your email.`);
    } catch (error) {
      console.error('Error RSVPing:', error);
    }
  };

  const filteredEvents = displayEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'All' || event.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Community Events</h1>
          </div>
          <p className="text-slate-400">Join webinars, workshops, and meetups with the community.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900/50 px-3 py-1.5 border border-slate-800">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tip: RSVP to get event reminders</span>
          </div>
          {profile?.role !== 'client' && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="h-11 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/50 p-1 border border-slate-800">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
              activeTab === 'upcoming' 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
              activeTab === 'past' 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Past
          </button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Search events..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-800 bg-slate-950 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Webinar">Webinar</option>
            <option value="Workshop">Workshop</option>
            <option value="Meetup">Meetup</option>
            <option value="Conference">Conference</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-80 animate-pulse bg-slate-900/50" />
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group flex h-full flex-col overflow-hidden border-slate-800/50 bg-slate-900/30 transition-all hover:border-purple-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
                  <img 
                    src={`https://picsum.photos/seed/${event.id}/800/400`} 
                    alt={event.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-4 top-4 z-20 rounded-xl bg-slate-950/80 px-3 py-1.5 text-center backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">{event.date ? format(event.date.toDate(), 'MMM') : '???'}</p>
                    <p className="text-xl font-bold text-white leading-none">{event.date ? format(event.date.toDate(), 'dd') : '00'}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/20">
                      {event.type}
                    </span>
                    {event.location.toLowerCase().includes('online') || event.location.toLowerCase().includes('webinar') ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                        <Video className="h-3 w-3" /> Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="mb-6 line-clamp-2 text-sm text-slate-400 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-600" />
                        {event.date ? format(event.date.toDate(), 'hh:mm a') : '00:00'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-slate-600" />
                        {event.attendeesCount} / {event.capacity}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleRSVP(event)}
                      className={`w-full rounded-xl transition-all duration-300 ${
                        rsvpedEvents.has(event.id) 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                        : 'bg-slate-800 text-white hover:bg-purple-600'
                      }`}
                    >
                      {rsvpedEvents.has(event.id) ? 'Going' : 'RSVP Now'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-slate-900 p-6">
              <CalendarDays className="h-12 w-12 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No events found</h3>
            <p className="text-slate-500">Check back later for new community events</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Event"
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <Input
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              className="w-full h-24 rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="What's the event about?"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Date & Time</label>
              <Input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Type</label>
              <select
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                required
              >
                <option value="Webinar">Webinar</option>
                <option value="Workshop">Workshop</option>
                <option value="Meetup">Meetup</option>
                <option value="Conference">Conference</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Location</label>
              <Input
                placeholder="e.g., Online or City"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Capacity</label>
              <Input
                type="number"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
