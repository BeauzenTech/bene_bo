import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// ✅ Corrige ici le storageBucket !
const firebaseConfig = {
  apiKey: "AIzaSyBW8wXGAyiN3NJFqIvUOJ197jZ9ZlH7LUw",
  authDomain: "vabene-fbe27.firebaseapp.com",
  projectId: "vabene-fbe27",
  storageBucket: "vabene-fbe27.appspot.com", // ✅ Corrigé
  messagingSenderId: "707415040822",
  appId: "1:707415040822:web:5824eba5dce92c85438997",
  measurementId: "G-1907QM4HQZ",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Demande la permission + enregistrement du Service Worker
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const permission = Notification.permission;

    if (permission === "granted") {
      return await requestForToken(registration);
    } else if (permission === "default") {
      const permissionResult = await Notification.requestPermission();
      if (permissionResult === "granted") {
        return await requestForToken(registration);
      } else {
        console.error("❌ Permission refusée");
        return null;
      }
    } else {
      console.error(
        "❌ Permission bloquée. Change les paramètres du navigateur !"
      );
      return null;
    }
  } catch (err) {
    console.error(
      "❌ Erreur lors de l'enregistrement du Service Worker :",
      err
    );
    return null;
  }
};

// ✅ Récupération du token avec le Service Worker
export const requestForToken = async (
  registration: ServiceWorkerRegistration
): Promise<string | null> => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BJHn3ttRwAVIQ0iVO2ZEiDXtyZxWi5IAPFK7fBzp8-qG_CUBg0uO1XEU_-zAKjkYnbnXHTidbEam2iTL2EZsdZ0",
      serviceWorkerRegistration: registration,
    });
    return token;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du token :", error);
    return null;
  }
};

export const onMessageListener = (): Promise<any> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
