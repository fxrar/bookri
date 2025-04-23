import { LocalNotifications } from '@capacitor/local-notifications';

function parseTimeString(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

async function checkPermission() {
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display === 'granted') {
    return true;
  } else {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }
}

async function scheduleDailyNotification(time) {
  const { hours, minutes } = parseTimeString(time);

  await LocalNotifications.schedule({
    notifications: [
      {
        title: 'Bookri Reminder',
        body: 'Time to read your book!',
        id: 1,
        schedule: {
          on: { hour: hours, minute: minutes },
          repeats: true,
        },
        sound: null,
        attachments: null,
        actionTypeId: '', // Set if you have custom actions
        extra: { bookId: 123, reminderType: 'daily' },
      },
    ],
  });
}

async function cancelNotifications() {
  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  console.log('Notifications cancelled');
}

async function setupBookriReminder(time) {
  const hasPermission = await checkPermission();
  if (hasPermission) {
    await scheduleDailyNotification(time);
    console.log('Notification scheduled for every day at', time);
    return true;
  } else {
    console.log('Permission denied for notifications.');
    return false;
  }
}

export {
  setupBookriReminder,
  checkPermission,
  scheduleDailyNotification,
  parseTimeString,
  cancelNotifications,
};
