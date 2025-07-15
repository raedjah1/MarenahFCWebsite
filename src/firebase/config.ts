// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Firebase configuration object using Vite environment variables
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDAmTqSgouRudpvPjBbjlVILlxClItKjhA",
  authDomain: "marenah-fc.firebaseapp.com",
  projectId: "marenah-fc",
  storageBucket: "marenah-fc.firebasestorage.app",
  messagingSenderId: "1098683793543",
  appId: "1:1098683793543:web:87045348418f3ad37e3822",
  measurementId: "G-TDBQP7JNYL",
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName],
);

if (missingVars.length > 0) {
  console.error(
    "Missing required Firebase environment variables:",
    missingVars.join(", "),
  );
  throw new Error(
    `Missing Firebase configuration. Please set: ${missingVars.join(", ")}`,
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize emulators in development mode
if (
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true"
) {
  try {
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, "localhost", 8080);

    // Connect to Auth emulator
    connectAuthEmulator(auth, "http://localhost:9099");

    // Connect to Storage emulator
    connectStorageEmulator(storage, "localhost", 9199);

    // Connect to Functions emulator
    connectFunctionsEmulator(functions, "localhost", 5001);

    console.log("🔧 Connected to Firebase emulators");
  } catch (error) {
    // Emulators already connected or not available
    console.log("Firebase emulators connection skipped");
  }
}

// Export the app instance
export default app;

// Export Firebase configuration for debugging
export { firebaseConfig };
