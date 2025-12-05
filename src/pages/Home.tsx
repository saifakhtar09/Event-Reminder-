import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';
import TimeWidget from '../components/TimeWidget';
import EventCard from '../components/EventCard';
import { LayoutDashboard, LogOut, Plus } from 'lucide-react';

export default function Home() {
  const { events } = useEvents();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const upcomingEvents = events
    .filter(event => event.status === 'upcoming')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 6);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-16 gap-4">

            <motion.h1 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent"
            >
              Event Reminder
            </motion.h1>

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">

              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm sm:text-base text-gray-700 font-medium"
              >
                Welcome, {user?.name}
              </motion.span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <WeatherWidget />
          <TimeWidget />
        </div>

        {/* Header + Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Upcoming Events</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Stay on top of your schedule</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" /> Create Event
          </motion.button>
        </div>

        {/* Event Cards */}
        {upcomingEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-10 text-center"
          >
            <p className="text-gray-600 text-lg">No upcoming events. Create one to get started!</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {upcomingEvents.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
