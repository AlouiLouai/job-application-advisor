// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics"; // Added isSupported

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCemPEQZ3kxU3eAuiFx3V-i_DXuiceB09o",
  authDomain: "jobadvisor-6772c.firebaseapp.com",
  projectId: "jobadvisor-6772c",
  storageBucket: "jobadvisor-6772c.firebasestorage.app",
  messagingSenderId: "469273699663",
  appId: "1:469273699663:web:8e09c7f329b37e65b4913a",
  measurementId: "G-80HZRSLXML"
};

// Initialize Firebase
// To prevent reinitialization in Next.js/HMR environments
let app;
if (!getApps().length) {  app = initializeApp(firebaseConfig);} else {  app = getApp(); // if already initialized, use that one}

const auth = getAuth(app);
let analytics;

// Check if analytics is supported by the browser environment before initializing
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
