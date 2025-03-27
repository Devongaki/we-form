import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Check if we have the minimum required configuration
const hasRequiredConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase only if we have the required configuration
const app = hasRequiredConfig ? initializeApp(firebaseConfig) : null;
const db = hasRequiredConfig ? getFirestore(app) : null;

// Initialize Analytics only if we're in a browser environment and have config
let analytics = null;
if (hasRequiredConfig && typeof window !== "undefined") {
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

export { app, db, analytics };
