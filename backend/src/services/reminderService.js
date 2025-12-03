import cron from 'node-cron';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendPushNotification } from '../utils/pushNotification.js';

export const startReminderScheduler = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Running reminder check...');

      const now = new Date();
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);

      const events = await Event.find({
        dateTime: {
          $gte: now,
          $lte: thirtyMinutesFromNow
        },
        reminderSent: false,
        status: 'upcoming'
      }).populate('userId');

      console.log(`Found ${events.length} events requiring reminders`);

      for (const event of events) {
        const user = await User.findById(event.userId);

        if (user && user.pushSubscription) {
          const payload = {
            title: 'Event Reminder',
            body: `"${event.title}" starts in 30 minutes!`,
            icon: event.imageUrl || '/icon.png',
            data: {
              eventId: event._id,
              url: '/dashboard'
            }
          };

          const result = await sendPushNotification(user.pushSubscription, payload);

          if (result.success) {
            event.reminderSent = true;
            await event.save();
            console.log(`Reminder sent for event: ${event.title}`);
          } else {
            console.error(`Failed to send reminder for event: ${event.title}`);
          }
        }
      }
    } catch (error) {
      console.error('Error in reminder scheduler:', error);
    }
  });

  console.log('Reminder scheduler started (runs every 5 minutes)');
};

export const updateEventStatuses = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Updating event statuses...');

      const now = new Date();
      const result = await Event.updateMany(
        {
          dateTime: { $lt: now },
          status: 'upcoming'
        },
        {
          $set: { status: 'completed' }
        }
      );

      console.log(`Updated ${result.modifiedCount} events to completed status`);
    } catch (error) {
      console.error('Error updating event statuses:', error);
    }
  });

  console.log('Event status updater started (runs every hour)');
};
