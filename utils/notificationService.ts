
import { getToken, Messaging } from "firebase/messaging";
import { getMessagingInstance } from "../firebase";
import { supabase } from "../supabase";

// SECURITY: In a production environment, this key should only exist in a backend Edge Function.
const FIREBASE_SERVER_KEY = "AlzaSyCaLyZ5kYNU4ghWqA_MBwMb0_283fphICO"; 

/**
 * Requests permission and saves the FCM token to Supabase under 'admin_settings'
 */
export const subscribeAdminDevice = async (): Promise<string | null> => {
  console.log("Initiating admin device subscription...");
  let token: string | null = null;

  try {
    const messaging = await getMessagingInstance();
    
    if (messaging) {
        // 1. Explicitly register Service Worker to ensure availability
        let registration;
        try {
            registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log("Service Worker registered with scope:", registration.scope);
        } catch (swError) {
            console.warn("Service Worker registration failed (likely due to environment). Switching to simulation.");
            throw new Error("SW_FAILED");
        }

        // 2. Request Notification Permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            alert("Notification permission was denied.");
            return null;
        }

        // 3. Get FCM Token
        try {
            token = await getToken(messaging as Messaging, {
                serviceWorkerRegistration: registration
            });
        } catch (tokenError) {
            console.warn("Failed to get FCM token. Switching to simulation.", tokenError);
            throw new Error("TOKEN_FAILED");
        }
    } else {
        throw new Error("MESSAGING_NOT_SUPPORTED");
    }
  } catch (error) {
    console.log("Entering Simulation Mode due to:", (error as any).message);
    // Fallback for non-HTTPS/Dev environments
    token = `simulated_token_${Date.now()}`;
  }

  if (token) {
      console.log("Device Token (Real or Simulated):", token);
      
      // 4. Save to Supabase
      const { error } = await supabase
        .from('xevon_content')
        .upsert({ 
          section: 'admin_settings', 
          data: { fcm_token: token, updated_at: new Date().toISOString() } 
        }, { onConflict: 'section' });

      if (error) {
          console.error("Supabase save error:", error);
          alert("Database Error: Failed to save device link.");
          return null;
      }

      if (token.startsWith("simulated_")) {
          alert("Notice: Push API unavailable (requires HTTPS). Simulation Mode active. Notifications will appear in-app.");
      } else {
          // Success for real token
      }

      return token;
  }

  return null;
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
      return;
    }

    const adminToken = data.data.fcm_token;

    // Handle Simulated Token
    if (adminToken.startsWith("simulated_")) {
        console.log(`[SIMULATED PUSH] ${title}: ${body}`);
        // Try native notification if permission granted (works on localhost without FCM sometimes)
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
                new Notification(title, { 
                    body, 
                    icon: "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" 
                });
            } catch (e) {
                // Ignore errors in restricted environments
            }
        }
        return;
    }

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
       console.error("Error 401: Unauthorized FCM Key");
    } else if (result.failure > 0) {
       const errorMsg = result.results?.[0]?.error || "Unknown error";
       console.error("FCM Failure:", errorMsg);
    } else {
       console.log("Notification sent successfully.");
    }

  } catch (err) {
    console.error("Failed to send notification:", err);
  }
};
