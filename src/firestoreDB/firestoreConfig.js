// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import dotenv from "dotenv";
//cargo las variables de entorno
dotenv.config();


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "coderhouse-ecommerce-fd0fa.firebaseapp.com",
  projectId: "coderhouse-ecommerce-fd0fa",
  storageBucket: "coderhouse-ecommerce-fd0fa.appspot.com",
  messagingSenderId: "945126862781",
  appId: "1:945126862781:web:4f7a73d904d8322ba06cd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);