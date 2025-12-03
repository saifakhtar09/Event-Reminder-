export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    });
  }
}

export function scheduleEventReminder(eventTitle: string, eventDateTime: string) {
  const eventTime = new Date(eventDateTime).getTime();
  const now = Date.now();
  const reminderTime = eventTime - (30 * 60 * 1000);
  const timeUntilReminder = reminderTime - now;

  if (timeUntilReminder > 0) {
    setTimeout(() => {
      showNotification('Event Reminder', {
        body: `${eventTitle} starts in 30 minutes!`,
        tag: eventTitle,
        requireInteraction: true
      });
    }, timeUntilReminder);
  }
}

export function checkUpcomingEvents(events: Array<{ title: string; dateTime: string; status: string }>) {
  const now = Date.now();

  events.forEach(event => {
    if (event.status === 'upcoming') {
      const eventTime = new Date(event.dateTime).getTime();
      const timeUntilEvent = eventTime - now;
      const thirtyMinutes = 30 * 60 * 1000;

      if (timeUntilEvent > 0 && timeUntilEvent <= thirtyMinutes + 60000) {
        scheduleEventReminder(event.title, event.dateTime);
      }
    }
  });
}
