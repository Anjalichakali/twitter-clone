import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAE2hQ50Um-z9RBH8asz7mhLmJlmp66JuQ",
  authDomain: "twitter-project-d707c.firebaseapp.com",
  projectId: "twitter-project-d707c",
  storageBucket: "twitter-project-d707c.appspot.com",
  messagingSenderId: "807825649929",
  appId: "1:807825649929:web:2773efab654530603463d8",
  measurementId: "G-3ZH7NK96KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const functions = getFunctions(app);

const sendOTP = httpsCallable(functions, "sendOTP"); // Cloud function to send OTP

export { auth, provider, signInWithPopup, signOut, sendOTP };
