importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA5Ey7k-Bwy0HvRV6pdlO9pfDLGJwoHhsw",
  authDomain: "lishay-barber.firebaseapp.com",
  projectId: "lishay-barber",
  storageBucket: "lishay-barber.firebasestorage.app",
  messagingSenderId: "15318341086",
  appId: "1:15318341086:web:1a7dcdf7f11fbe6ea1394f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Lishay Barber';
  const body = payload.notification?.body || '';
  self.registration.showNotification(title, {
    body,
    icon: '/barber/icon-192.png',
    badge: '/barber/icon-192.png',
    data: { title, body }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const title = event.notification.data?.title || '';
  const body = event.notification.data?.body || '';
  const targetUrl = 'https://lishayhaim.github.io/barber/?msg=' + encodeURIComponent(body) + '&msgtitle=' + encodeURIComponent(title);
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
