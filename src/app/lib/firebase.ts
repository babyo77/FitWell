import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Messaging, getMessaging } from "firebase/messaging";
let messaging: Messaging | null = null;
const firebaseConfig = {
  apiKey: "AIzaSyAQiqu-ckWeCrNb2QlemF4crmQ8XAAai9I",
  authDomain: "fitwell-403b7.firebaseapp.com",
  projectId: "fitwell-403b7",
  storageBucket: "fitwell-403b7.firebasestorage.app",
  messagingSenderId: "233665594332",
  appId: "1:233665594332:web:5075c2c94d7ce104b24519",
  measurementId: "G-1W385WMDJ9",
};
export const app = initializeApp(firebaseConfig);

if ("serviceWorker" in navigator) {
  messaging = getMessaging(app);
}
export { messaging };
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
