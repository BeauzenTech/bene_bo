// public/firebase-messaging-sw.js

// ⚠️ Pas besoin de "firebase/compat"
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Initialise Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBW8wXGAyiN3NJFqIvUOJ197jZ9ZlH7LUw",
    projectId: "vabene-fbe27",
    messagingSenderId: "707415040822",
    appId: "1:707415040822:web:5824eba5dce92c85438997",
});

// Récupère l’instance Messaging
const messaging = firebase.messaging();

// Notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title;
    const notificationOptions = {
        body: payload.notification?.body,
        icon: payload.notification?.image || '/icons/icon-192x192.png', // si disponible
    };

    self.registration.showNotification(title, {
        body: body,
        icon: icon, // ou ton icône
        sound: 'default', // n'est pas toujours requis ici, mais peut aider
    });
});