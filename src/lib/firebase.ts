import { deleteApp, FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyBvX9x2IFLzG5nf8akzWmzLuv7r442XiKY",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "travel-edu-app.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "travel-edu-app",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "travel-edu-app.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "877659971350",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:877659971350:web:c2007f550ed752c590ba37",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-6WVY3WMVH5"
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const db: Firestore | null = app ? getFirestore(app) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const analyticsPromise: Promise<Analytics | null> =
  app && typeof window !== "undefined"
    ? isSupported().then((supported) => (supported ? getAnalytics(app) : null))
    : Promise.resolve(null);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "psnkzeducation@gmail.com";

export function createTemporaryAuth() {
  const temporaryApp = initializeApp(
    firebaseConfig,
    `manual-user-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );

  return {
    auth: getAuth(temporaryApp),
    dispose: () => deleteApp(temporaryApp)
  };
}
