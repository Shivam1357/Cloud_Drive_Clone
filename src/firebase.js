// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdQqc89urD9BAz72Z6I2gBYlvlp-8cgtw",
  authDomain: "shivam-jaiswal.firebaseapp.com",
  projectId: "shivam-jaiswal",
  storageBucket: "shivam-jaiswal.appspot.com",
  messagingSenderId: "1048599657848",
  appId: "1:1048599657848:web:bccc1e1c5fca6b5e2f5c8d",
  measurementId: "G-2QG8C1338B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db}