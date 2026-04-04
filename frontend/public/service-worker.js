// Service Worker for Habit Tracker push notifications
// This file must live in /public so it's served from the root scope

self.addEventListener("push", (event) => {
  let data = { title: "HabitTrace", body: "Time to check in on your habit!" };

  if (event.data) {
    try {
      data = JSON.parse(event.data.text());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [200, 100, 200],
    tag: "habit-timer-notification",
    renotify: true,
    data: { url: self.registration.scope },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus an existing tab if one is open, otherwise open a new one
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
