import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCtSvlcFQAt-rrx1Gvp6bD9aigHAL9i-xk",
  authDomain: "algebra-help.firebaseapp.com",
  databaseURL: "https://algebra-help-default-rtdb.firebaseio.com",
  projectId: "algebra-help",
  storageBucket: "algebra-help.firebasestorage.app",
  messagingSenderId: "764430547836",
  appId: "1:764430547836:web:853ddaaff19d9e3cc242f9",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
