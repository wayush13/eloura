import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQ_jaFgunHrA87HAfzYkbTu26OgJ9if6U",
  authDomain: "eloura-69251.firebaseapp.com",
  projectId: "eloura-69251",
  storageBucket: "eloura-69251.firebasestorage.app",
  messagingSenderId: "474879902218",
  appId: "1:474879902218:web:190e0d92b48271959ad5f3",
  measurementId: "G-THJS38T83C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };