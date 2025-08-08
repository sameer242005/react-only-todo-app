// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVF_U6919TfRSnQteS-qtDamFzApuLf5Q",
  authDomain: "login-signup-app2-36d89.firebaseapp.com",
  projectId: "login-signup-app2-36d89",
  storageBucket: "login-signup-app2-36d89.firebasestorage.app",
  messagingSenderId: "577010662211",
  appId: "1:577010662211:web:308abeb8c1de9bae0b8df6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // <-- NEW: Initialize Firestore

// Export the service instances
export { db }; // Export db (and auth if you initialized it)

 