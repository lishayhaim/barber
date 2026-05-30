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
  return;
});

function savePendingNotif(title, body) {
  return new Promise((resolve) => {
    const req = indexedDB.open('barber-notif', 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore('notifs');
    req.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction('notifs', 'readwrite');
      tx.objectStore('notifs').put({ title, body, ts: Date.now() }, 'pending');
      tx.oncomplete = resolve;
    };
    req.onerror = resolve;
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const title = event.notification.title || 'Lishay Barber';
  const body = event.notification.body || '';
  
  event.waitUntil(
    savePendingNotif(title, body).then(() => {
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // שלח הודעה לחלונות פתוחים
        for (const client of clientList) {
          client.postMessage({ type: 'push-clicked', title, body });
        }
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return self.clients.openWindow('https://lishayhaim.github.io/barber/');
      });
    })
  );
});
