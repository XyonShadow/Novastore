// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Config from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDSzADDKNuzg4GpVK7FXIt1O6aH09rCV54",
  authDomain: "novastore-a2f32.firebaseapp.com",
  projectId: "novastore-a2f32",
  storageBucket: "novastore-a2f32.firebasestorage.app",
  messagingSenderId: "605403009737",
  appId: "1:605403009737:web:57e9da118b35eefd52b318"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };