import dotenv from 'dotenv';
dotenv.config();  // MUST be first

import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Log env check
console.log("JWT Loaded:", process.env.JWT_SECRET ? "YES" : "NO");

// CORS Setup
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Event Reminder API Live 🚀",
    routes: ['/api/auth', '/api/events', '/api/notifications']
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use(errorHandler);

// Run server only in development
if (process.env.NODE_ENV !== "production") {

  await connectDB();   // DB must connect BEFORE server start

  const { startReminderScheduler, updateEventStatuses } = await import('./services/reminderService.js');
  startReminderScheduler();
  updateEventStatuses();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
}

export default app;
