import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, Edit2 } from 'lucide-react';
import { Event } from '../contexts/EventContext';
import { useState } from 'react';
import UpdateEventModal from './UpdateEventModal';

interface EventCardProps {
  event: Event;
  onDelete?: (id: string) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  console.log('EventCard received event:', event);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Use custom image if provided, otherwise use default
  const imageUrl = event.image && event.image.trim() && event.image !== 'null'
    ? event.image 
    : 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to default image if custom image fails to load
    const img = e.target as HTMLImageElement;
    console.log('Image failed to load:', imageUrl);
    img.src = 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={imageUrl}
          alt={event.title}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
            event.status === 'upcoming'
              ? 'bg-green-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{formatDate(event.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{formatTime(event.dateTime)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUpdateModalOpen(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex-1"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </motion.button>
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(event.id)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors flex-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          )}
        </div>

        <UpdateEventModal 
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          event={event}
        />
      </div>
    </motion.div>
  );
}