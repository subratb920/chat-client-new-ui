// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm0b9b_-mg_1nODHjHrAc2TJUqarYWnlA",
  authDomain: "chainchat-31747.firebaseapp.com",
  projectId: "chainchat-31747",
  storageBucket: "chainchat-31747.appspot.com",
  messagingSenderId: "586452469944",
  appId: "1:586452469944:web:a5e0c3387b39544ecfcc4d",
  measurementId: "G-D8WV25EKRP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
