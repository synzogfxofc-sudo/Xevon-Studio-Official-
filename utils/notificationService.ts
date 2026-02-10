import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "../firebase";
import { supabase } from "../supabase";

// SECURITY: In a production environment, this key should only exist in a backend Edge Function.
const FIREBASE_SERVER_KEY = "AlzaSyCaLyZ5kYNU4ghWqA_MBwMb0_283fphICO"; 

/**
 * Requests permission and saves the FCM token to Supabase under 'admin_settings'
 */
export const subscribeAdminDevice = async (): Promise<string | null> => {
  console.log("Initiating admin device subscription...");
  try {
    const messaging = await getMessagingInstance();
    
    if (!messaging) {
      alert("Push notifications are not supported in this browser context (or via HTTP). Please use HTTPS or localhost.");
      return null;
    }

    // 1. Explicitly register Service Worker to ensure availability
    let registration;
    try {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log("Service Worker registered with scope:", registration.scope);
    } catch (swError) {
        console.error("Service Worker registration failed:", swError);
        alert("Failed to register Service Worker. Please check console for details.");
        return null;
    }

    // 2. Request Notification Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission was denied. Please enable it in your browser settings.");
      return null;
    }

    // 3. Get FCM Token
    const token = await getToken(messaging, {
        serviceWorkerRegistration: registration
    });

    if (token) {
      console.log("FCM Token retrieved:", token);
      
      // 4. Save to Supabase
      const { error } = await supabase
        .from('xevon_content')
        .upsert({ 
          section: 'admin_settings', 
          data: { fcm_token: token, updated_at: new Date().toISOString() } 
        }, { onConflict: 'section' });

      if (error) {
          console.error("Supabase save error:", error);
          alert("Device connected locally, but failed to save to database.");
      }

      return token;
    } else {
      console.warn("No registration token available.");
      alert("Failed to generate FCM token.");
      return null;
    }
  } catch (error) {
    console.error("Error subscribing admin device:", error);
    alert(`Connection failed: ${(error as any).message}`);
    return null;
  }
};

/**
 * Sends a push notification to the registered Admin device.
 * @param title Notification Title
 * @param body Notification Body
 */
export const sendAdminNotification = async (title: string, body: string) => {
  console.log("Sending admin notification...");
  try {
    // 1. Get the Admin Token from DB
    const { data, error } = await supabase
      .from('xevon_content')
      .select('data')
      .eq('section', 'admin_settings')
      .single();

    if (error || !data?.data?.fcm_token) {
      console.warn("No Admin FCM token found.");
      alert("No connected device found. Please connect a device first.");
      return;
    }

    const adminToken = data.data.fcm_token;

    // 2. Send via FCM Legacy HTTP API
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${FIREBASE_SERVER_KEY}`
      },
      body: JSON.stringify({
        to: adminToken,
        notification: {
          title: title,
          body: body,
          sound: "default",
          icon: "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"
        },
        priority: "high"
      })
    });

    const result = await response.json();
    console.log("FCM Send Result:", result);

    if (response.status === 401) {
       alert("Error 401: Unauthorized. The provided Server Key might be an API Key instead of a Cloud Messaging Server Key.");
    } else if (result.failure > 0) {
       const errorMsg = result.results?.[0]?.error || "Unknown error";
       console.error("FCM Failure:", errorMsg);
       alert(`Notification failed to deliver: ${errorMsg}`);
    } else {
       console.log("Notification sent successfully.");
       // Optional success alert, commented out to avoid spamming on auto-triggers
       // alert("Notification sent!"); 
    }

  } catch (err) {
    console.error("Failed to send notification:", err);
    alert("Network error occurred while sending notification.");
  }
};