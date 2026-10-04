import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwXNDw7tiKjKuRF1afLNIPiY-pButolbA",
  authDomain: "cinemate-21526.firebaseapp.com",
  projectId: "cinemate-21526",
  storageBucket: "cinemate-21526.firebasestorage.app",
  messagingSenderId: "908184317883",
  appId: "1:908184317883:web:9eb444dd086bf846539e9e",
  measurementId: "G-PVXFBT5NP5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
