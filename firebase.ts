import { initializeApp } from "firebase/app";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

// Configuration from provided keys
const firebaseConfig = {
  apiKey: "AlzaSyCaLyZ5kYNU4ghWqA_MBwMb0_283fphICO", 
  authDomain: "xevon-studio.firebaseapp.com",
  projectId: "xevon-studio",
  storageBucket: "xevon-studio.appspot.com",
  messagingSenderId: "722644283222",
  appId: "1:722644283222:ios:ecef090c16b052d33af0f7"
};

export const app = initializeApp(firebaseConfig);

// Asynchronously get messaging instance only if supported
export const getMessagingInstance = async (): Promise<Messaging | null> => {
  try {
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    }
    console.warn("Firebase Messaging not supported in this browser.");
    return null;
  } catch (err) {
    console.error("Error checking messaging support", err);
    return null;
  }
};

export const VAPID_KEY = "BNb_t_..."; 
