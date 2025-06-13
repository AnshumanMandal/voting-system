import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug: Log configuration (remove in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('Firebase Config Status:', {
    apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
    appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing'
  });

  // Validate configuration
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.error('⚠️ Missing Firebase Configuration:', missingKeys.join(', '));
    throw new Error(`Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}`);
  }
}

let app;
let db;
let auth;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { db, auth };