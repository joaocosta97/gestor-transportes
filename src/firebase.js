// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoYCSn7MAs_x0S-srk9ilvZD2UjmI_Zf8",
  authDomain: "gestor-transportes.firebaseapp.com",
  projectId: "gestor-transportes",
  storageBucket: "gestor-transportes.firebasestorage.app",
  messagingSenderId: "122269694638",
  appId: "1:122269694638:web:9b604a4c8dc9c03f6ccb3f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
