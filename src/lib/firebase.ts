import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4QSc_y8R1v_hyZUppuQIiZX4NSikg094",
  authDomain: "karungali.firebaseapp.com",
  projectId: "karungali",
  storageBucket: "karungali.firebasestorage.app",
  messagingSenderId: "1021720000812",
  appId: "1:1021720000812:web:509b04583d8a4346f45489"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;