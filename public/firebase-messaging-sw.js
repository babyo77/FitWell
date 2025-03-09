importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAQiqu-ckWeCrNb2QlemF4crmQ8XAAai9I",
  authDomain: "fitwell-403b7.firebaseapp.com",
  projectId: "fitwell-403b7",
  storageBucket: "fitwell-403b7.firebasestorage.app",
  messagingSenderId: "233665594332",
  appId: "1:233665594332:web:5075c2c94d7ce104b24519",
  measurementId: "G-1W385WMDJ9",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.message,
    icon: "https://fitwell-403b7.web.app/icons/icon-512x512.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
