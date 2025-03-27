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

// Debug log to check environment variables
console.log("Firebase Config:", {
  projectId: firebaseConfig.projectId || "missing",
  authDomain: firebaseConfig.authDomain || "missing",
  storageBucket: firebaseConfig.storageBucket || "missing",
  messagingSenderId: firebaseConfig.messagingSenderId || "missing",
  appId: firebaseConfig.appId || "missing",
  measurementId: firebaseConfig.measurementId || "missing",
});

let app = null;
let db = null;
let analytics = null;

// Initialize Firebase only in browser environment
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // Initialize Analytics
    isSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      })
      .catch(console.error);

    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, db, analytics };
