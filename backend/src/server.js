import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// CORS
// CORS - Allow all origins for now
   app.use(cors({
     origin: '*',
     credentials: false,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Event Reminder API Live 🚀',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      notifications: '/api/notifications'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

// 🚨 IMPORTANT — Do NOT listen here when deploying to Vercel
if (process.env.NODE_ENV !== "production") {
  import('./services/reminderService.js').then(({ startReminderScheduler, updateEventStatuses }) => {
    startReminderScheduler();
    updateEventStatuses();
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on ${PORT}`);
  });
}

export default app;  // <-- Required for serverless
