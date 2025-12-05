import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { eventAPI } from '../services/api';

export interface Event {
  id: string;
  title: string;
  dateTime: string;
  image?: string;
  status: 'upcoming' | 'completed';
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'status' | 'userId'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  loading: boolean;
  error: string | null;
  refetchEvents: () => Promise<void>; // <-- expose a method to refetch events after login
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch events if a token exists
    if (localStorage.getItem('token')) {
      fetchEvents();
      const interval = setInterval(updateEventStatuses, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventAPI.getAll();
      const eventsData = response.data.data || [];
      
      const formatted: Event[] = eventsData.map((e: any) => ({
        id: e.id || e._id,
        title: e.title,
        dateTime: e.dateTime,
        image: e.image || undefined,
        status: e.status === 'completed' ? 'completed' : 'upcoming',
        userId: e.userId,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      }));

      setEvents(formatted);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch events';
      setError(msg);
      console.error('Fetch error:', msg);
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatuses = () => {
    const now = new Date();
    setEvents(events.map(ev => ({
      ...ev,
      status: new Date(ev.dateTime) < now ? 'completed' : 'upcoming'
    })));
  };

  const addEvent = async (event: Omit<Event, 'id' | 'status' | 'userId'>) => {
    try {
      setError(null);
      const response = await eventAPI.create(event.title, event.dateTime, event.image);
      const e = response.data.data;
      const newEvent: Event = {
        id: e.id || e._id,
        title: e.title,
        dateTime: e.dateTime,
        image: e.image || undefined,
        status: e.status === 'completed' ? 'completed' : 'upcoming',
        userId: e.userId,
        createdAt: e.createdAt,
      };
      setEvents([...events, newEvent]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      setError(null);
      const response = await eventAPI.update(id, updates);
      const e = response.data.data;
      const updated: Event = {
        id: e.id || e._id,
        title: e.title,
        dateTime: e.dateTime,
        image: e.image || undefined,
        status: e.status === 'completed' ? 'completed' : 'upcoming',
        userId: e.userId,
      };
      setEvents(events.map(ev => ev.id === id ? updated : ev));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setError(null);
      await eventAPI.delete(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
      throw err;
    }
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, filter, setFilter, loading, error, refetchEvents: fetchEvents }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within an EventProvider');
  return context;
}
