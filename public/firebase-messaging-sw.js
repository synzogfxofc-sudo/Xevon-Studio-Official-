// Scripts for firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AlzaSyCaLyZ5kYNU4ghWqA_MBwMb0_283fphICO",
  authDomain: "xevon-studio.firebaseapp.com",
  projectId: "xevon-studio",
  storageBucket: "xevon-studio.appspot.com",
  messagingSenderId: "722644283222",
  appId: "1:722644283222:ios:ecef090c16b052d33af0f7"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || 'https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});