// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  authDomain: "qudus-oluwasegun-portfolio.firebaseapp.com",
  storageBucket: "qudus-oluwasegun-portfolio.appspot.com",
  appId: "1:952168251952:web:fed5d1e2a99f7a05e063f5",
  apiKey: "AIzaSyCVL0_Qjp0_YNAqEnhE1NqzxTs8Vj3b-Ak",
  projectId: "qudus-oluwasegun-portfolio",
  messagingSenderId: "952168251952",
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