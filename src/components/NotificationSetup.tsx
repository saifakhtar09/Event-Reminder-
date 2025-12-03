import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { requestNotificationPermission, checkUpcomingEvents } from '../utils/notifications';
import { useEvents } from '../contexts/EventContext';

export default function NotificationSetup() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { events } = useEvents();

  useEffect(() => {
    const checkPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    if (Notification.permission === 'granted') {
      checkUpcomingEvents(events);

      const interval = setInterval(() => {
        checkUpcomingEvents(events);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [events]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowPrompt(false);
      checkUpcomingEvents(events);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-6 max-w-sm z-50"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">Enable Notifications</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get reminded 30 minutes before your events start
              </p>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnableNotifications}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                >
                  Enable
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPrompt(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Later
                </motion.button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPrompt(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
