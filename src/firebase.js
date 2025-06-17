// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Uncomment if you need Firestore
import { getStorage } from "firebase/storage"; // Uncomment if you need Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP4xna6IOlgw-4VCGbkkDUDtAJuObZEBk",
  authDomain: "movieweb-doan.firebaseapp.com",
  projectId: "movieweb-doan",
  storageBucket: "movieweb-doan.firebasestorage.app",
  messagingSenderId: "1022779251400",
  appId: "1:1022779251400:web:b6225ab6912f8042dee3fd",
  measurementId: "G-N74NM22TVX"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
// Khởi tạo Auth + Provider + Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Uncomment if you need Firestore
const storage = getStorage(app); // Uncomment if you need Storage

export { auth, provider, db, storage };