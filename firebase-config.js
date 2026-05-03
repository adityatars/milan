// HIVI.gaming — Firebase Configuration
// Replace these values with your Firebase project credentials
// Get them from: https://console.firebase.google.com → Project Settings → General → Your apps

const firebaseConfig = {
  apiKey: "AIzaSyCzWvr85_fO-NW9JeOS1DSH-hOVlQY2kIE",
  authDomain: "salessimulator-25c61.firebaseapp.com",
  projectId: "salessimulator-25c61",
  storageBucket: "salessimulator-25c61.firebasestorage.app",
  messagingSenderId: "377190088754",
  appId: "1:377190088754:web:90c95afa8834925053fc2b",
  measurementId: "G-GQQPSLRTQ0"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  window.FIREBASE = { auth, db };
} catch(e) {
  console.error('Firebase Initialization Error. Please check firebase-config.js credentials.', e);
  window.FIREBASE = { 
    auth: { onAuthStateChanged: (cb) => cb(null), signInWithPopup: () => Promise.reject(new Error('Firebase not configured')) },
    db: { collection: () => ({ orderBy: () => ({ get: () => Promise.resolve({docs:[]}) }) }) }
  };
}
