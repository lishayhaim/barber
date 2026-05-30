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

// לא מציגים התראה ידנית — Firebase עושה זאת אוטומטית
// רק שומרים את הנתונים ל-notificationclick
messaging.onBackgroundMessage((payload) => {
  // Firebase יציג את ההתראה אוטומטית מה-notification payload
  // אנחנו רק מעדכנים את ה-data
  return;
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const title = event.notification.title || 'Lishay Barber';
  const body = event.notification.body || '';
  const url = 'https://lishayhaim.github.io/barber/?pushmsg=' + encodeURIComponent(body) + '&pushtitle=' + encodeURIComponent(title);
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        try { return clientList[0].navigate(url).then(c => c && c.focus()); } catch(e) {}
      }
      return self.clients.openWindow(url);
    })
  );
});
