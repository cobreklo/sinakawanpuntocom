// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ REEMPLAZA ESTO CON TUS PROPIAS CREDENCIALES DE FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCEjuNEzaIVag3lKHnarLZXPbL6Zu229-M",
  authDomain: "shoutbox-sinaka.firebaseapp.com",
  projectId: "shoutbox-sinaka",
  storageBucket: "shoutbox-sinaka.firebasestorage.app",
  messagingSenderId: "363199823674",
  appId: "1:363199823674:web:d824b8d9e06cf1882e9a03"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la referencia a la base de datos (Firestore)
export const db = getFirestore(app);