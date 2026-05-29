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
  const title = event.notification.data?.title || 'Lishay Barber';
  const body = event.notification.data?.body || '';
  
  event.waitUntil(
    // שמור את ההודעה ב-IndexedDB כדי שהאפליקציה תקרא אותה
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // שלח לכל החלונות הפתוחים
      for (const client of clientList) {
        client.postMessage({ type: 'push-clicked', title, body });
      }
      // פתח את האפליקציה עם פרמטרים ב-URL
      const url = 'https://lishayhaim.github.io/barber/?pushmsg=' + encodeURIComponent(body) + '&pushtitle=' + encodeURIComponent(title);
      if (clientList.length > 0) {
        return clientList[0].navigate(url).then(c => c.focus()).catch(() => self.clients.openWindow(url));
      }
      return self.clients.openWindow(url);
    })
  );
});
