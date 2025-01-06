// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  storageBucket: "kaysviuals-portfolio.firebasestorage.app",
  authDomain: "kaysviuals-portfolio.firebaseapp.com",
  appId: "1:570886722008:web:3a9169b6884cd2fbe922ad",
  apiKey: "AIzaSyDlr16lzeJbnxLx4KbeS0IFHLGuCwoItjA",
  projectId: "kaysviuals-portfolio",
  messagingSenderId: "570886722008",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firestoreDB = getFirestore(firebaseApp);

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}