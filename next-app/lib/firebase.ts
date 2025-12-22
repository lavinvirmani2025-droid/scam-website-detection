import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3vhwGWw2jqQgSlWbHEjbP4obeRQZdaP4",
  authDomain: "scam-detection-63d7d.firebaseapp.com",
  projectId: "scam-detection-63d7d",
  storageBucket: "scam-detection-63d7d.firebasestorage.app",
  messagingSenderId: "356956796992",
  appId: "1:356956796992:web:72676b49b3e84100b9c7a5",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
